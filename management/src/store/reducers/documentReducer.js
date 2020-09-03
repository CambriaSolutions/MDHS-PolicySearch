import * as actionTypes from '../actions/actionTypes'

const initialState = {
    documents: [],
    isWorking: false,
    isUploading: false,
    filterPhrase: ''
}

const filterDocuments = (documents, filterPhrase) => {
        const filteredDocuments = documents.map(document => {
            document.isVisible = document.name.toLowerCase().includes((filterPhrase || '').toLowerCase())                
            return document
        })
        return filteredDocuments
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LISTING_DOCUMENTS:
            return {
                ...state,
                isWorking: true,
            }
        case actionTypes.LISTING_DOCUMENTS_SUCCESS:
            return {
                ...state,
                isWorking: false,
                documents: filterDocuments(action.payload, state.filterPhrase),
            }
        case actionTypes.LISTING_DOCUMENTS_FAILURE:
            return {
                ...state,
                isWorking: false,
            }
        case actionTypes.UPLOADING_DOCUMENT:
            return {
                ...state,
                isWorking: true,
                isUploading: true,
            }
        case actionTypes.UPLOAD_DOCUMENT_SUCCESS:
            return {
                ...state,
                isWorking: false,
                isUploading: false,
            }
        case actionTypes.UPLOAD_DOCUMENT_FAILURE:
            return {
                ...state,
                isWorking: false,
                isUploading: false,
            }
        case actionTypes.DELETE_DOCUMENT:
            return {
                ...state,
                isWorking: true,
            }
        case actionTypes.DELETE_DOCUMENT_SUCCESS:
            return {
                ...state,
                isWorking: false,
            }
        case actionTypes.DELETE_DOCUMENT_FAILURE:
            return {
                ...state,
                isWorking: false,
            }
        case actionTypes.PROCESSING_STATUS_UPDATE:
            const documents = state.documents.map(document => {
                if (document.name === action.payload.name) {
                    document.processingStatus = action.payload.processingStatus
                }

                return document
            })
            return {
                ...state,
                documents: documents
            }
        case actionTypes.FILTER_DOCUMENTS:
            return {
                ...state,
                filterPhrase: action.payload.filterPhrase,
                documents: filterDocuments(state.documents, action.payload)
            }
        default:
            return state
    }
}

export default reducer