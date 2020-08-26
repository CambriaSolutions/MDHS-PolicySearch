import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toggleSettings } from '../store/actions/configActions'
import styled from 'styled-components'

// Material UI
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'

// Icons
import BookOutlined from '@material-ui/icons/BookOutlined'
import SettingsIcon from '@material-ui/icons/Settings'

const ToolbarTitle = styled(Typography)`
  flex-grow: 1;
  margin-left: 10px !important;
`

class Header extends Component {
  render() {
    return (
      <AppBar position='static' color='primary'>
        <Toolbar>
          <BookOutlined />
          <ToolbarTitle variant='h5' color='inherit'>
            Policy Search Management
          </ToolbarTitle>
          <IconButton
            color='inherit'
            onClick={() => this.props.onSettingsToggle(true)}
            aria-label='Open settings'
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    )
  }
}

const mapStateToProps = state => {
  return {
    mainColor: "#ffebee",
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSettingsToggle: showSettings => dispatch(toggleSettings(showSettings)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)
