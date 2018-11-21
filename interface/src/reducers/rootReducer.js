import { combineReducers } from 'redux'
import config from './configReducer'
import content from './contentReducer'

const rootReducer = combineReducers({
  config,
  content,
})

export default rootReducer
