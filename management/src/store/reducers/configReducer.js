import * as actionTypes from '../actions/actionTypes'

const initialState = {
  loading: false,
  showSettings: false,
  snackbarOpen: false,
  snackbarMessage: '',
  intentDetails: [],
  loadingIntentDetails: false,
  showIntentModal: false,
  updateRealtime: true,
}


const reducer = (state = initialState, action) => {
  switch (action.type) {
    // Metrics
    case actionTypes.TOGGLE_SETTINGS:
      return {
        ...state,
        showSettings: action.showSettings,
      }
    case actionTypes.TOGGLE_CONFIG_LOADING:
      return {
        ...state,
        loading: action.loading,
      }
    case actionTypes.CLOSE_SNACKBAR:
      return {
        ...state,
        snackbarOpen: false,
      }
    case actionTypes.SHOW_SNACKBAR:
      return {
        ...state,
        snackbarOpen: true,
        snackbarMessage: action.message,
      }
    default:
      return state
  }
}

export default reducer
