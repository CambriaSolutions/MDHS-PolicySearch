import * as actionTypes from '../actions/actionTypes'

const initialState = {
    documents: [],
    isListing: false,
    isUploading: false,
    isDeleting: false,
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LISTING_DOCUMENTS:
            return {
                ...state,
                isListing: true,
            }
        case actionTypes.LISTING_DOCUMENTS_SUCCESS:
            return {
                ...state,
                isListing: false,
                documents: action.payload
            }
        case actionTypes.LISTING_DOCUMENTS_FAILURE:
            return {
                ...state,
                isListing: false,
            }
        case actionTypes.UPLOADING_DOCUMENT:
            return {
                ...state,
                isUploading: true
            }
        case actionTypes.UPLOAD_DOCUMENT_SUCCESS:
            return {
                ...state,
                isUploading: false,
            }
        case actionTypes.UPLOAD_DOCUMENT_FAILURE:
            return {
                ...state,
                isUploading: false,
            }
        case actionTypes.DELETE_DOCUMENT:
            return {
                ...state,
                isDeleting: true
            }
        case actionTypes.DELETE_DOCUMENT_SUCCESS:
            return {
                ...state,
                isDeleting: false,
            }
        case actionTypes.DELETE_DOCUMENT_FAILURE:
            return {
                ...state,
                isDeleting: false,
            }
        default:
            return state
    }
}

export default reducer