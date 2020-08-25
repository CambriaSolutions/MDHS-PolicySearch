import {
  UPDATE_MATCH_DATA,
  ADD_PAGE_TO_SEARCH_RESULTS,
  SHOW_LOADING_SPINNER,
  INITIAL_LOAD_COMPLETE,
  SET_DOWNLOAD_URL,
  STORE_ABORT_CONTROLLER,
} from './actionTypes'
import 'whatwg-fetch'
import uniq from 'lodash/uniq'
import get from 'lodash/get'
import find from 'lodash/find'
import { storage } from '../firebase'
import { saveAs } from 'file-saver'
import { toggleSnackbarOpen } from './navigationActions'

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
    const documentNames = []

    data.forEach(page => {
      const fileName = get(page, 'fileName', null)
      if (fileName) {
        documentNames.push(fileName)
      }
      promises.push(getStorageUrlForPage(page.fileName, page.pageNumber))
    })

    let documentNamesToSearch = uniq(documentNames)

    documentNamesToSearch.forEach(document => {
      dispatch(getURLForDownloadPage(document))
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
        dispatch({
          type: UPDATE_MATCH_DATA,
          pages: [],
          keywords: [],
          highlights: [],
          bestPage: { pageNumber: 1 },
        })
        dispatch({ type: SHOW_LOADING_SPINNER, isLoading: false })
        dispatch(toggleSnackbarOpen('Error fetching documents'))
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

    // Create an abort controller https://developer.mozilla.org/en-US/docs/Web/API/AbortController
    const controller = new AbortController()
    const signal = controller.signal
    dispatch({ type: STORE_ABORT_CONTROLLER, abortController: controller })

    const timeoutID = setTimeout(() => {
      controller.abort()
      dispatch({ type: SHOW_LOADING_SPINNER, isLoading: false })
      dispatch(
        toggleSnackbarOpen(
          'The network is taking longer than usual, please try again.'
        )
      )
    }, 30000)

    try {
      let url = new URL(process.env.REACT_APP_SEARCH_ENDPOINT)
      const params = { userSays: userSays }
      Object.keys(params).forEach(key =>
        url.searchParams.append(key, params[key])
      )

      const response = await fetch(url, { signal })
      const data = await response.json()

      clearTimeout(timeoutID)
      dispatch(updateMatchData(data))
    } catch (err) {
      clearTimeout(timeoutID)

      // If the user opted to cancel the request, the abort controller
      // returns the error message string below.
      if (err.message === 'The user aborted a request.') {
        dispatch({ type: SHOW_LOADING_SPINNER, isLoading: false })
      } else {
        dispatch(
          toggleSnackbarOpen(
            'Unable to access knowledge base, please try again.'
          )
        )
        dispatch({ type: SHOW_LOADING_SPINNER, isLoading: false })
        console.error(err)
      }
    }
  }
}

export function cancelRequest() {
  return (dispatch, getState) => {
    const controller = getState().config.abortController
    if (controller) {
      controller.abort()
      dispatch({ type: STORE_ABORT_CONTROLLER, abortController: null })
      dispatch(toggleSnackbarOpen('Search cancelled.'))
    }
  }
}

export function getURLForDownloadPage(docName) {
  return async (dispatch, getState) => {
    if (docName) {
      const documentDownloadUrls = getState().content.documentDownloadUrls

      const fullDocumentDownloadData = find(documentDownloadUrls, {
        docName: docName,
      })

      // If not, get the download url from storage, and set to redux
      if (!fullDocumentDownloadData) {
        let docNameAndURL = {}
        try {
          const url = await storage.ref(docName).getDownloadURL()
          docNameAndURL = { downloadURL: url, docName: docName }
          dispatch({
            type: SET_DOWNLOAD_URL,
            downloadURLData: docNameAndURL,
          })
        } catch (error) {
          dispatch(toggleSnackbarOpen('Document not available for download.'))
          console.error(error)
        }
      }
    }
  }
}

export function saveCurrentDocument(docName) {
  return async (dispatch, getState) => {
    const documentDownloadUrls = getState().content.documentDownloadUrls

    const fullDocumentDownloadData = find(documentDownloadUrls, {
      docName: docName,
    })

    if (fullDocumentDownloadData.downloadURL) {
      try {
        const xhr = new XMLHttpRequest()
        xhr.responseType = 'blob'
        xhr.onload = event => {
          const file = new Blob([xhr.response], {
            type: 'application/pdf',
          })
          saveAs(file, docName)
        }
        xhr.open('GET', fullDocumentDownloadData.downloadURL)
        xhr.send()
      } catch (error) {
        dispatch(toggleSnackbarOpen('Document not available for download.'))
        console.error(error)
      }
    } else {
      dispatch(toggleSnackbarOpen('Document not available for download.'))
    }
  }
}
