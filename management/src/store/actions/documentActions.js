import * as actionTypes from '../actions/actionTypes'
import { db, storage } from '../../Firebase'
import { format } from 'date-fns'

const getItemData = async (item) => {
    const metadata = await item.getMetadata()
    const downloadUrl = await item.getDownloadURL()

    return { metadata: metadata, downloadUrl: downloadUrl }
}

const getDocumentInformation = async (snapshot) => {
    const promises = []
    snapshot.items.forEach(item => { promises.push(getItemData(item)) })
    return Promise.all(promises)
}

const updateProcessingStatus = () => {
    return dispatch => {
        db.collection('documents').get().then(snapshot => {
            snapshot.forEach(document => {
                if (document.exists) {
                    dispatch({
                        type: actionTypes.PROCESSING_STATUS_UPDATE,
                        payload: { name: document.id + '.pdf', processingStatus: document.data().processingStatus }
                    })
                }
            })
        })
    }    
}

let unsubscribe
export const registerListeners = () => {
    return dispatch => {
        unsubscribe = db.collection('documents').onSnapshot(snapshot => {
            snapshot.forEach(document => {
                if (document.exists) {
                    dispatch({
                        type: actionTypes.PROCESSING_STATUS_UPDATE,
                        payload: { name: document.id + '.pdf', processingStatus: document.data().processingStatus }
                    })
                }
            })
        })
    }
}

export const clearListeners = () => {
    return dispatch => {
        if (unsubscribe) {
            unsubscribe()
            unsubscribe = undefined
        }
    }
}

export const listDocuments = (doRegistration) => {
    return dispatch => {
        dispatch({
            type: actionTypes.LISTING_DOCUMENTS
        })

        storage.ref().listAll()
            .then(snapshot => {
                getDocumentInformation(snapshot).then(items => {
                    const itemMap = items.map(item => {
                        const createdDate = new Date(item.metadata.timeCreated)
                        const timeCreated = format(createdDate, 'MMMM d, yyyy')
                        return { name: item.metadata.name, timeCreated: timeCreated, downloadUrl: item.downloadUrl }
                    })

                    dispatch({
                        type: actionTypes.LISTING_DOCUMENTS_SUCCESS,
                        payload: itemMap
                    })

                    if (doRegistration) {
                        dispatch(registerListeners())
                    } else {
                        dispatch(updateProcessingStatus())
                    }
                })                
            })
            .catch(err => {
                console.error(err)
                dispatch({
                    type: actionTypes.LISTING_DOCUMENTS_FAILURE,
                })
            })
    }
}

export const filterDocuments = (filterPhrase) => {
    return dispatch => {
        dispatch({
            type: actionTypes.FILTER_DOCUMENTS,
            payload: filterPhrase
        })
    }
}

export const uploadDocument = (document) => {
    return dispatch => {
        dispatch({
            type: actionTypes.UPLOADING_DOCUMENT,
        })

        storage.ref().child(document.name).put(document)
            .then(() => {
                setTimeout(() => {
                    dispatch({
                        type: actionTypes.UPLOAD_DOCUMENT_SUCCESS,
                    })
                    dispatch(listDocuments(false))
                }, 2000)                
            }).catch(err => {
                console.error(err)
                dispatch({
                    type: actionTypes.UPLOAD_DOCUMENT_FAILURE,
                })
            })
    }
}

export const deleteDocument = (documentName) => {
    return dispatch => {
        dispatch({
            type: actionTypes.DELETE_DOCUMENT,
        })

        storage.ref().child(documentName).delete()
            .then(() => {
                setTimeout(() => {
                    dispatch({
                        type: actionTypes.DELETE_DOCUMENT_SUCCESS,
                    })
                    dispatch(listDocuments(false))
                }, 2000)
            }).catch(err => {
                console.error(err)
                dispatch({
                    type: actionTypes.DELETE_DOCUMENT_FAILURE,
                })
            })
    }
}
