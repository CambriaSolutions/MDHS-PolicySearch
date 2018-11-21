const flatten = require('lodash/flatten')
const uniq = require('lodash/uniq')
const language = require('@google-cloud/language')

// Instantiates a client using default permissions for project
const client = new language.LanguageServiceClient()

// Performs entity analysis to extract the entities (proper nouns or phrases)
// that may be excluded from the more strict syntax search
// https://cloud.google.com/natural-language/docs/analyzing-entities#language-entities-string-nodejs
function getEntities(document) {
  return client
    .analyzeEntities({ document })
    .then(results => {
      const entities = results[0].entities
      const entityKeywords = entities.map(entity => {
        return entity.name.toLowerCase().split(' ')
      })
      return flatten(entityKeywords)
    })
    .catch(err => {
      throw new Error(err)
    })
}
// Performs synatactic analysis to return the root (the main verb in the
// sentence) and the adjectives and nouns from the text
// https://cloud.google.com/natural-language/docs/analyzing-syntax
function getSyntax(document) {
  return client
    .analyzeSyntax({ document })
    .then(results => {
      const syntax = results[0]
      const wantedPartsOfSpeech = ['adj', 'noun', 'num']
      const badWords = ['is', 'be', 'are']
      const wantedTags = ['root', 'amod', 'pcomp', 'advcl']
      const syntaxKeyWords = syntax.tokens.map(part => {
        const wordLabel = part.dependencyEdge.label.toLowerCase()
        const tag = part.partOfSpeech.tag.toLowerCase()
        const content = part.text.content
        if (
          wantedTags.includes(wordLabel) &&
          tag !== 'adp' &&
          !badWords.includes(content)
        ) {
          return content.toLowerCase()
        } else if (wantedPartsOfSpeech.includes(tag)) {
          return content.toLowerCase()
        }
        return null
      })
      return syntaxKeyWords.filter(Boolean)
    })
    .catch(err => {
      throw new Error(err)
    })
}
// Initiates the request to Google's Cloud Natural Language API in order to extract relevant words from the user's input https://cloud.google.com/natural-language/
function getQueryKeywords(userInput) {
  return new Promise((resolve, reject) => {
    if (!userInput) {
      resolve(null)
    }
    const document = {
      content: userInput,
      type: 'PLAIN_TEXT',
    }
    const nlpPromises = [getEntities(document), getSyntax(document)]
    Promise.all(nlpPromises)
      .then(results => {
        const merged = uniq(flatten(results))
        const keyWordString = merged.join(' ').toLowerCase()
        return resolve(keyWordString)
      })
      .catch(err => {
        reject(err)
      })
  })
}

module.exports = getQueryKeywords
