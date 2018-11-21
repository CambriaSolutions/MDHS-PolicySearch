function generateDeleteBatch(docs) {
  // Query CloudSearch and Generate a Delete Batch
  console.info(`Generating delete batch with size ${docs.length}`)
  return new Promise((resolve, reject) => {
    try {
      const deleteBatch = docs.hits.hit.map(doc => {
        return { type: 'delete', id: doc.id }
      })
      console.info(`Success: Generated delete batch`)
      resolve(deleteBatch)
    } catch (error) {
      console.error(`errors: ${error}`)
      reject(error)
    }
  })
}

module.exports = generateDeleteBatch
