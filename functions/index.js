require('dotenv').config()
const admin = require('firebase-admin')
const functions = require('firebase-functions')
admin.initializeApp(functions.config().firebase)
admin.firestore().settings({ timestampsInSnapshots: true })
const glob = require('glob')
const camelCase = require('camelcase')

// Get all files ending in .function.js, excluding
// anything inside of node-modules
const files = glob.sync('./**/*.function.js', {
  cwd: __dirname,
  ignore: './node_modules/**',
})

// Clean up function names to be camelCase and export
// each function as the appropriate function name
// See: https://github.com/firebase/functions-samples/issues/170
for (let f = 0, fl = files.length; f < fl; f++) {
  const file = files[f]
  const functionName = camelCase(
    file
      .slice(0, -12)
      .split('/')
      .join('_'),
  )

  if (
    !process.env.FUNCTION_NAME ||
    process.env.FUNCTION_NAME === functionName
  ) {
    exports[functionName] = require(file)
  }
}
