import { combineReducers } from 'redux'
import auth from './authReducer'
import config from './configReducer'

const rootReducer = combineReducers({
  auth,
  config,
})

export default rootReducer
