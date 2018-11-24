import {
  UPDATE_MATCH_DATA,
  ADD_PAGE_TO_SEARCH_RESULTS,
  SHOW_LOADING_SPINNER,
  INITIAL_LOAD_COMPLETE,
} from './actionTypes'
import 'whatwg-fetch'
import { storage } from '../firebase'

export function addPageToSearchResults(page) {
  return (dispatch, getState) => {
    dispatch({
      type: ADD_PAGE_TO_SEARCH_RESULTS,
      page: page,
    })
  }
}

export function getStorageUrlForPage(docName, pageNum) {
  if (docName && pageNum) {
    // remove file extension
    const fileName = docName.replace(/\.[^/.]+$/, '')
    const pdfRef = storage.ref(`output/${fileName}/${pageNum}.pdf`)
    const thumbRef = storage.ref(`output/${fileName}/thumb_${pageNum}.png`)
    return Promise.all([pdfRef.getDownloadURL(), thumbRef.getDownloadURL()])
      .then(results => {
        return {
          pdfUrl: results[0],
          thumbUrl: results[1],
        }
      })
      .catch(error => {
        switch (error.code) {
          case 'storage/object_not_found':
            // File doesn't exist
            console.log(`${docName} pg. ${pageNum} doesn't exist`)
            break

          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            console.log(`User doesn't have permission`)
            break
          case 'storage/canceled':
            // User canceled the upload
            console.log('User canceled')
            break

          case 'storage/unknown':
            // Unknown error occurred, inspect the server response
            console.log('Unknown error in storage')
            break

          default:
            console.log('Unknown error in storage')
            break
        }
      })

    // const fireStoreCollectionDoc = db
    //   .collection('documents')
    //   .doc(`${fileName}/pages/pg-${pageNum}`)

    // return fireStoreCollectionDoc
    //   .get()
    //   .then(doc => {
    //     if (!doc.exists) {
    //       console.error('Document does not exist')
    //       return {
    //         pdfUrl: '',
    //         thumbUrl: '',
    //       }
    //     } else {
    //       return {
    //         pdfUrl: doc.data().pdfUrl,
    //         thumbUrl: doc.data().thumbUrl,
    //       }
    //     }
    //   })
    //   .catch(error => {
    //     console.log(error)
    //     return {
    //       pdfUrl: '',
    //       thumbUrl: '',
    //     }
    //   })
  } else {
    return new Promise(function(resolve, reject) {
      resolve({ pdfUrl: '', thumbUrl: '' })
    })
  }
}

export function updateMatchData(response) {
  return (dispatch, getState) => {
    const data = response.pages
    // No matches
    if (data.length === 0) {
      dispatch({
        type: UPDATE_MATCH_DATA,
        pages: [],
        keywords: [],
        highlights: [],
        bestPage: { pageNumber: 1 },
      })
      dispatch({ type: SHOW_LOADING_SPINNER, isLoading: false })
      return
    }
    data.forEach(page => {
      page.score = parseFloat(page.score)
      page.pageNumber = parseInt(page.pageNumber, 10)
    })
    data.sort((a, b) => {
      return b.score - a.score
    })

    const keywords = response.keywords.split(' ')
    const highlights = response.highlights
    const promises = []
    data.forEach(page => {
      promises.push(getStorageUrlForPage(page.fileName, page.pageNumber))
    })
    Promise.all(promises)
      .then(results => {
        for (let i in data) {
          data[i] = Object.assign({}, data[i], results[i])
        }
        dispatch({
          type: UPDATE_MATCH_DATA,
          pages: data,
          keywords: keywords,
          highlights: highlights,
          bestPage: data[0],
        })
        dispatch({ type: SHOW_LOADING_SPINNER, isLoading: false })
      })
      .catch(err => {
        // TODO: Error handling in UI
        // TODO: Separate into own action
        dispatch({
          type: UPDATE_MATCH_DATA,
          pages: [],
          keywords: [],
          highlights: [],
          bestPage: { pageNumber: 1 },
        })
        dispatch({ type: SHOW_LOADING_SPINNER, isLoading: false })
        return
      })
  }
}

export function queryCloudSearch(userSays) {
  return async (dispatch, getState) => {
    if (!userSays || userSays === '') {
      return
    }
    dispatch({ type: SHOW_LOADING_SPINNER, isLoading: true })
    dispatch({ type: INITIAL_LOAD_COMPLETE })
    let url = new URL(process.env.REACT_APP_CLOUD_SEARCH_ENDPOINT)
    const params = { userSays: userSays }
    Object.keys(params).forEach(key =>
      url.searchParams.append(key, params[key])
    )
    try {
      const response = await fetch(url)
      const data = await response.json()
      dispatch(updateMatchData(data))
    } catch (err) {
      console.error(err)
    }
  }
}
