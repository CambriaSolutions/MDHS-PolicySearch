import React, { Component } from 'react'
import { connect } from 'react-redux'
import Header from './Header'
import Dashboard from './Dashboard'

import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'

class ThemedApp extends Component {
  render() {
    const theme = {
      palette: {
        primary: { main: this.props.mainColor },
      },
      typography: {
        fontSize: 13,
      },
    }
    return (
      <MuiThemeProvider theme={createMuiTheme(theme)}>
        <div className='App'>
          <Header />
          <Dashboard />
        </div>
      </MuiThemeProvider>
    )
  }
}

const mapStateToProps = state => {
  return {
    mainColor: "#ffebee",
  }
}

export default connect(mapStateToProps)(ThemedApp)
