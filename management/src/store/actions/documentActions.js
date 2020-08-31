import * as actionTypes from '../actions/actionTypes'
import { storage } from '../../Firebase'
import { format } from 'date-fns'

const getDocumentInformation = async (snapshot) => {
    const promises = []
    snapshot.items.forEach(item => {
        promises.push(item.getMetadata())
    })

    return Promise.all(promises)
}

export const listDocuments = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.LISTING_DOCUMENTS
        })

        storage.ref().listAll()
            .then(snapshot => {
                getDocumentInformation(snapshot).then(items => {
                    const itemMap = items.map(item => {
                        const createdDate = new Date(item.timeCreated)
                        const timeCreated = format(createdDate, 'MM-dd-yyyy')
                        return { name: item.name, timeCreated: timeCreated }
                    })

                    dispatch({
                        type: actionTypes.LISTING_DOCUMENTS_SUCCESS,
                        payload: itemMap
                    })
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

export const uploadDocument = (document) => {
    return dispatch => {
        dispatch({
            type: actionTypes.UPLOADING_DOCUMENT,
        })

        storage.ref().child(document.name).put(document)
            .then(() => {
                dispatch({
                    type: actionTypes.UPLOAD_DOCUMENT_SUCCESS,
                })
                dispatch(listDocuments)
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
                dispatch({
                    type: actionTypes.DELETE_DOCUMENT_SUCCESS,
                })
                dispatch(listDocuments)
            }).catch(err => {
                console.error(err)
                dispatch({
                    type: actionTypes.DELETE_DOCUMENT_FAILURE,
                })
            })
    }
}
