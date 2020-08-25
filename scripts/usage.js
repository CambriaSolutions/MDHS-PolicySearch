require('dotenv').config()
const fs = require('fs')
const moment = require('moment')
const admin = require('firebase-admin')
const app = admin.initializeApp()
const db = admin.firestore()

const getDate = (date) => { return moment(date).format('MM/DD/YYYY') }

const buildMetricObj = (startDate, endDate) => {
    const metrics = {}

    let date = new Date(startDate)
    do {
        const day = getDate(date)
        metrics[day] = {
            requests: 0
        }
        date.setDate(date.getDate() + 1)
    } while (date < endDate)

    return metrics
}

const getUsageMetrics = async (startDate, endDate) => {
    const metrics = buildMetricObj(startDate, endDate)

    const batchSize = 1000;
    let lastBatchDoc
    let position = 0
    let hasResults = false
    do {
        let snapshot
        if (lastBatchDoc !== undefined) {
            snapshot = await db.collection('requests').orderBy('timestamp').startAfter(lastBatchDoc).limit(batchSize).get();
        } else {
            snapshot = await db.collection('requests').orderBy('timestamp').limit(batchSize).get();
        }

        if (snapshot.empty) {
            hasResults = false;
        } else {
            snapshot.docs.forEach(doc => {
                let data = doc.data()
                const date = data.timestamp.toDate()
                if (date >= startDate && date <= endDate) {
                    const day = getDate(date)
                    metrics[day].requests = metrics[day].requests + 1
                }
            })

            hasResults = true
            position += batchSize
            lastBatchDoc = snapshot.docs[snapshot.docs.length - 1]
        }
    } while (hasResults === true)

    console.log(`Date,Requests`)
    Object.entries(metrics).forEach(([date, val]) => {
        console.log(`${date},${val.requests}`)
    })
}

const getAnalytics = async () => {
    const snap = snapshot = await db.collection('analytics').get()

    const analytics = {}
    snap.docs.forEach(doc => {
        analytics[doc.id] = doc.data()
    })

    // console.log(analytics)
    console.log('Phrase,Num times Asked')
    Object.entries(analytics.summaryData.keywords).forEach(([phrase, num]) => {
        console.log(`"${phrase}",${num}`)
    })
}

getAnalytics()

//getUsageMetrics(new Date(2019, 9, 9), new Date(2020, 9, 9))
