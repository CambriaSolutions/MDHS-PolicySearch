import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../store/actions/index'
import styled from 'styled-components'
import Settings from './Settings'
import DocumentList from '../components/DocumentList'

// Material UI
import Drawer from '@material-ui/core/Drawer'

// Components
import CircularProgress from '@material-ui/core/CircularProgress'

const rootStyles = {
  flexGrow: 1,
  margin: '2.5% 3%',
}

function Dashboard(props) {
  const { isLoggedIn, isLoading, isAuthenticating, mainColor, showSettings, onSettingsToggle } = props

  const CenterDiv = styled.div`
    text-align: center;
    margin: auto;
    width: 1200px;
    height: 900px;
    max-width: 100%;
    max-height: 100%;
    overflow: auto;
    .material-icons {
      font-size: 65px;
      color: ${mainColor};
    }
  `

  let centerDiv
  if (!isLoggedIn || isLoading || isAuthenticating) {
    centerDiv = (
      <CenterDiv>
        <h2>Loading...</h2>
        <CircularProgress />
      </CenterDiv>
    )
  } else {
    centerDiv = (
      <div>
        <CenterDiv>
          <DocumentList />
        </CenterDiv>
      </div>
    )
  }

  let dashboard = (
    <div style={rootStyles}>
      <Drawer
        anchor='right'
        open={showSettings}
        onClose={onSettingsToggle}>
        <Settings />
      </Drawer>
      {centerDiv}
    </div>
  )

  return dashboard
}

const mapDispatchToProps = dispatch => {
  return {
    onSettingsToggle: () => dispatch(actions.toggleSettings(false)),
  }
}

const mapStateToProps = state => {
  return {
    mainColor: state.config.mainColor,
    showSettings: state.config.showSettings,
    isLoggedIn: state.auth.isLoggedIn,
    isLoading: state.auth.isLoading,
    isAuthenticating: state.auth.isAuthenticating,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)