const PDFParser = require('pdf2json')

function parseContent(buffer) {
  console.info(`Starting raw PDF content parsing`)
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(this, 1)

    pdfParser.parseBuffer(buffer)

    pdfParser.on('pdfParser_dataError', errData => {
      reject(
        new Error(`Error: Could Not Parse the PDF: ${errData.parserError}`),
      )
    })

    pdfParser.on('pdfParser_dataReady', pdfData => {
      console.info(`Success: got raw PDF content`)
      resolve(pdfParser.getRawTextContent())
    })
  })
}

module.exports = parseContent
