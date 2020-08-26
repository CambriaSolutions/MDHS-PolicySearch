import * as actionTypes from '../actions/actionTypes'

export const toggleSettings = showSettings => {
  return {
    type: actionTypes.TOGGLE_SETTINGS,
    showSettings: showSettings,
  }
}

export const toggleConfigLoading = loading => {
  return {
    type: actionTypes.TOGGLE_CONFIG_LOADING,
    loading: loading,
  }
}

export function closeSnackbar() {
  return { type: actionTypes.CLOSE_SNACKBAR }
}

export function showSnackbar(message) {
  return { type: actionTypes.SHOW_SNACKBAR, message }
}
