import { combineReducers } from 'redux'
import auth from './authReducer'
import config from './configReducer'
import document from './documentReducer'

const rootReducer = combineReducers({
  auth,
  config,
  document,
})

export default rootReducer
