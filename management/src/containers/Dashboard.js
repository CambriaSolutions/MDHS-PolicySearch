import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../store/actions/index'
import styled from 'styled-components'
import Settings from './Settings'

// Material UI
import Drawer from '@material-ui/core/Drawer'

// Components
import CircularProgress from '@material-ui/core/CircularProgress'

const rootStyles = {
  flexGrow: 1,
  margin: '2.5% 3%',
}

class Dashboard extends Component {
  render() {
    const CenterDiv = styled.div`
      text-align: center;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 300px;
      height: 300px;
      max-width: 100%;
      max-height: 100%;
      overflow: auto;
      .material-icons {
        font-size: 65px;
        color: ${this.props.mainColor};
      }
    `

    return (
      <div style={rootStyles}>
        <Drawer
          anchor='right'
          open={this.props.showSettings}
          onClose={this.props.onSettingsToggle}>
          <Settings />
        </Drawer>
        <CenterDiv>
          <h2>Loading...</h2>
          <CircularProgress />
        </CenterDiv>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    mainColor: "#ffebee",
    showSettings: state.config.showSettings,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSettingsToggle: () => dispatch(actions.toggleSettings(false)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
