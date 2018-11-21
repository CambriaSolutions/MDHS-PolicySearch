import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import './styles/normalize.css'

import { db } from './firebase'
// Webfonts
import WebFont from 'webfontloader'

// Redux Core
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'

// Redux Middleware
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction'

// Redux reducer
import rootReducer from './reducers/rootReducer'

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunkMiddleware))
)

WebFont.load({
  google: {
    families: ['Roboto:300,400,500,700', 'Google Sans:500', 'Material Icons'],
  },
})

db.collection('documents').onSnapshot(querySnapshot => {
  let documentMetadata = []
  querySnapshot.forEach(doc => {
    const metadata = {
      id: doc.id,
      totalPages: doc.data().pageCount,
    }
    documentMetadata.push(metadata)
  })
  store.dispatch({ type: 'STORE_METADATA', documentMetadata })
})

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
})

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
