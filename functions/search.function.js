const functions = require('firebase-functions')
const get = require('lodash/get')
const map = require('lodash/map')
const flatten = require('lodash/flatten')
const uniq = require('lodash/uniq')
const cors = require('cors')({
  origin: true,
})
const getQueryKeywords = require('./getQueryKeywords.js')
const performCloudSearch = require('./performCloudSearch.js')
const logRequest = require('./logRequest.js')

function extractHighlights(hits) {
  // this is *the* text that is *returned*
  const regex = /\*([^*]+)\*/gi
  const keywords = hits.map(hit => {
    let highlights = get(hit, 'highlights.content', '')
    let words = highlights.match(regex)
    let cleanWords = map(words, word => {
      return word
        .replace(/\*/g, '')
        .toLowerCase()
        .trim()
    })
    return cleanWords
  })
  return uniq(flatten(keywords))
}

exports = module.exports = functions
  .runWith({ memory: '2GB', timeoutSeconds: 60 })
  .https.onRequest((req, res) => {
    return cors(req, res, () => {
      // CloudSearch gives us options for how many fields we want to return, if we
      // want to return the confidence of match score, and whether we want to return
      // only very precise match(es) by specifying defaultOperator as 'and' or allow
      // less confidence scores to return by specifying 'or'.
      //https://docs.aws.amazon.com/cloudsearch/latest/developerguide/search-api.html

      const userSays = req.query.userSays
      // Don't proceed if no words
      if (!userSays || userSays === '') {
        return res.json({
          pages: [],
          keywords: '',
          highlights: '',
        })
      }

      const wordsArr = userSays.toLowerCase().split(' ')
      const wordsWithHyphens = wordsArr.filter(word => word.includes('-'))
      const wordsToExcludeFromKeywords = wordsWithHyphens.join('-').split('-')
      let responseContent = []
      // Takes the input from the user, extracts relevant keywords,
      // searches our CloudSearch knowledgebase, and returns an object with
      // page number(s) and keywords to be highlighted
      return getQueryKeywords(userSays)
        .then(keywords => {
          const uriBase = process.env.CLOUD_SEARCH_ENDPOINT
          const uri = `http://${uriBase}/2013-01-01/search`
          let searchOptions = {
            uri: uri,
            allFields: true,
            scoreFields: true,
            defaultOperator: 'or',
            searchFields: `['content','tags']`,
            phraseFields: `['content','tags']`,
            numberOfResults: 30,
          }
          const numberOfWords = keywords.split(' ').length
          if (numberOfWords >= 5) {
            searchOptions.defaultOperator = '50%'
          } else if (numberOfWords === 4) {
            searchOptions.defaultOperator = '75%'
          } else if (numberOfWords === 3) {
            searchOptions.defaultOperator = '90%'
          } else {
            searchOptions.defaultOperator = '100%'
          }
          return performCloudSearch(keywords, searchOptions)
        })
        .then(results => {
          const data = results.data
          const hits = data.hits.hit
          const keywords = results.keywords
          const keywordsArr = keywords.split(' ')
          const filteredKeywords = keywordsArr.filter(
            w => wordsToExcludeFromKeywords.indexOf(w) === -1 && w.length > 1,
          )
          const combinedKeywords = uniq([
            ...filteredKeywords,
            ...wordsWithHyphens,
          ])
          const highlights = extractHighlights(hits)
          const hasPageNumber = get(data, 'hits.hit[0].fields.pointer', null)
          let contentForInterface = {
            pages: [],
            keywords: combinedKeywords.join(' '),
            highlights: highlights,
          }
          if (hasPageNumber === null) {
            return contentForInterface
          } else {
            hits.forEach(hit => {
              contentForInterface.pages.push({
                pageNumber: hit.fields.pointer,
                fileName: hit.fields.filename,
                // content: hit.fields.content.replace(//g, ''),
                score: hit.fields._score,
              })
            })

            // Sorts the array page number(s) by confidence score
            contentForInterface.pages.sort((a, b) => b.score - a.score)
            return contentForInterface
          }
        })
        .then(content => {
          responseContent = content
          return res.json(content)
        })
        .then(() => {
          const log = {
            userSays: userSays,
            timestamp: new Date(),
            topPages: responseContent.pages.slice(0, 3),
            keywords: responseContent.keywords,
            highlights: responseContent.highlights,
          }
          return logRequest(log)
        })
        .catch(err => {
          throw err
        })
    })
  })
