require('dotenv').config()
const fs = require('fs')
const admin = require('firebase-admin')
const app = admin.initializeApp()
const db = admin.firestore()

const gettingPages = async (document) => {
    const snap = await db.collection(`documents/${document}/pages`).get()

    const pages = {}
    snap.docs.forEach(doc => {
        pages[doc.id] = doc.data()
    })

    return pages
}

const gettingDocuments = async () => {
    const snap = await db.collection('documents').get()

    const documents = {}
    snap.docs.forEach(doc => {
        documents[doc.id] = {
            data: doc.data(),
            pages: []
        }
    })

    return documents
}


const generateCasyBotBackup = async () => {
    const documents = await gettingDocuments()
    //console.log(documents)
    const documentNames = Object.keys(documents);
    for(let i = 0; i < documentNames.length; i++) {
        const document = documents[documentNames[i]]
        document.pages = await gettingPages(documentNames[i])
        fs.writeFileSync(`./${documentNames[i]}.json`, JSON.stringify(document))
    }
    // for(const index in documentEntries) {
    //     const document = documentEntries[index]
    //     document[1].pages = await gettingPages(document[0])
    //     fs.writeFileSync(`./${document.name}.json`, JSON.stringify(docEntry))
    // }
}

generateCasyBotBackup()