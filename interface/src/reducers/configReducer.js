import * as t from '../actions/actionTypes'

const initialState = {
  documentMetadata: [],
  initialLoad: false,
  abortController: null,
}

function config(state = initialState, action) {
  switch (action.type) {
    case t.STORE_METADATA:
      return {
        ...state,
        documentMetadata: action.documentMetadata,
      }
    case t.INITIAL_LOAD_COMPLETE:
      return {
        ...state,
        initialLoad: true,
      }
    case t.STORE_ABORT_CONTROLLER:
      return {
        ...state,
        abortController: action.abortController,
      }
    default:
      return state
  }
}

export default config
