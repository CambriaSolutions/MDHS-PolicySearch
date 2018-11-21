import * as t from '../actions/actionTypes'

const initialState = {
  documentMetadata: [],
  initialLoad: false,
}

function config(state = initialState, action) {
  switch (action.type) {
    case t.STORE_METADATA:
      return {
        ...state,
        documentMetadata: action.documentMetadata,
      }
    default:
      return state
    case t.INITIAL_LOAD_COMPLETE:
      return {
        ...state,
        initialLoad: true,
      }
  }
}

export default config
