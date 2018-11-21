const rp = require('request-promise')

// Our default is to send off a request to cast a wide net, return all values
// as well as confidence score
const defaultSearchOptions = {
  defaultOperator: 'or',
  allFields: true,
  score: true,
}

// Sends our keywords off to CloudSearch using the default search options
// if not specified by the searchOptions variable to return the page number(s)
// and associated confidence score(s)
function performCloudSearch(keywords, searchOptions) {
  return new Promise((resolve, reject) => {
    const options = Object.assign({}, defaultSearchOptions, searchOptions)
    const allFields = options.allFields
    const searchFields = options.searchFields
    const phraseFields = options.phraseFields
    const numberOfResults = options.numberOfResults
    const uri = options.uri
    const score = options.score
    const defaultOperator = options.defaultOperator
    const returnString = `${allFields ? '_all_fields' : ''},${
      score ? '_score' : ''
    }`
    const requestOptions = {
      method: 'GET',
      uri: uri,
      qs: {
        q: keywords,
        'q.parser': 'dismax',
        'highlight.content': `{format:'text', max_phrases:5}`,
        return: returnString,
        'q.options': `{defaultOperator: '${defaultOperator}',fields:${searchFields},phraseFields:${phraseFields} }`,
        size: numberOfResults,
      },
      json: true,
    }
    rp(requestOptions)
      .then(data => {
        return resolve({ data, keywords })
      })
      .catch(err => {
        reject(err)
      })
  })
}

module.exports = performCloudSearch
