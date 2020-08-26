import * as actionTypes from '../actions/actionTypes'
import { authRef } from '../../Firebase'
import { toggleSettings } from './configActions'
import { showSnackbar } from './configActions'
//import db from '../../Firebase'

export const fetchUser = () => dispatch => {
  authRef.onAuthStateChanged(user => {
    if (user) {
      dispatch(completeSignIn(user))
    } else {
      // If no user, reset auth state
      dispatch({
        type: actionTypes.SIGNOUT_USER,
      })
    }
  })
}

export const signIn = (username, pwd) => {
  return dispatch => {
    dispatch({
      type: actionTypes.SIGNIN_START,
    })
    authRef
      .signInWithEmailAndPassword(username, pwd)
      .then(result => {
        dispatch(completeSignIn(result))
      })
      .catch(error => {
        dispatch({
          type: actionTypes.SIGNIN_FAIL,
        })
        dispatch(showSnackbar(error.message))
      })
  }
}

export const completeSignIn = user => {
  return {
    type: actionTypes.SIGNIN_SUCCESS,
    user: user,
  }
}

export const resetPassword = () => {
  return (dispatch, getState) => {
    const user = getState().auth.user
    if (user) {
      authRef
        .sendPasswordResetEmail(user.email)
        .then(() => {
          dispatch(
            showSnackbar(
              `A password reset email has been sent to ${user.email}`
            )
          )
        })
        .catch(error => {
          console.log(error)
        })
    } else {
      dispatch(showSnackbar(`No user was found`))
    }
  }
}

export const signOut = () => dispatch => {
  authRef
    .signOut()
    .then(() => {
      dispatch(toggleSettings(false))
      dispatch({
        type: actionTypes.SIGNOUT_USER,
      })
    })
    .catch(error => {
      console.log(error)
    })
}
