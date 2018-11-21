function generateDocumentBatch(rawText, fileName) {
  console.info(`Generating document batch for ${fileName}`)

  return new Promise((resolve, reject) => {
    try {
      const pages = []
      let page = []
      let newPage = false

      const textArray = rawText.split('\r\n').map(text => {
        return text.trim()
      })

      for (let text of textArray) {
        if (text.includes('Page (') && text.includes('Break')) {
          newPage = true
        }

        if (newPage) {
          pages.push(page)
          page = []
          newPage = false
        } else {
          page.push(text)
        }
      }

      const batch = pages.map((page, index) => {
        const id = `${index + 1}-${fileName}`
        const content = page
          .join(' ')
          .replace(/  +/g, ' ')
          .trim()
        const pointer = `${index + 1}`

        return {
          type: 'add',
          id: id,
          fields: {
            content: content,
            filename: fileName, // this field must be lowercase per AWS
            pointer: pointer,
            tags: [],
          },
        }
      })
      console.info(`Success: generated document batch`)
      resolve(batch)
    } catch (error) {
      console.error(`error: ${error}`)
      reject(error)
    }
  })
}

module.exports = generateDocumentBatch
