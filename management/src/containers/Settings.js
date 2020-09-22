import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  toggleSettings
} from '../store/actions/configActions'
import { signOut, resetPassword } from '../store/actions/authActions'
import styled from 'styled-components'
import background from '../img/grey.png'

// Material UI
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import SecurityIcon from '@material-ui/icons/Security'
import CloudOffIcon from '@material-ui/icons/CloudOff'

const StyledDiv = styled.div`
  width: 250px;
  height: 100%;
  overflow-x: hidden;
  background-image: url(${background});
`

const BottomDiv = styled.div`
  position: absolute;
  left: 0;
  bottom: 10px;
  width: 100%;
`

const AuthButton = styled(Button)`
  border-radius: 0 !important;
  margin-bottom: 10px !important;
`
const AuthIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 5px;
`

class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      displayColorPicker: false,
      color: this.props.mainColor,
    }
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  }

  handleClose = () => {
    this.setState({ displayColorPicker: false })
    if (this.state.color !== this.props.mainColor) {
      this.props.onMainColorChange(this.props.mainColor, true)
      this.setState({ color: this.props.mainColor })
    }
  }

  handleChange = color => {
    this.props.onMainColorChange(color.hex)
  }

  render() {
    const TitleDiv = styled(Typography)`
      padding: 8px 0 8px 16px;
      color: #fff;
      background-color: ${this.props.mainColor};
    `

    return (
      <StyledDiv>
        <div>
          <TitleDiv variant='h6'>Settings</TitleDiv>
          <Divider />
        </div>
        <BottomDiv>
          <AuthButton
            color='primary'
            edge='end'
            aria-label='PasswordReset'
            variant='contained'
            fullWidth={true}
            onClick={this.props.onPwdReset}
          >
            <AuthIcon>
              <SecurityIcon />
            </AuthIcon>
            Change Password
          </AuthButton>
          <AuthButton
            color='primary'
            edge='end'
            aria-label='SignOut'
            variant='contained'
            fullWidth={true}
            onClick={this.props.onSignOut}
          >
            <AuthIcon>
              <CloudOffIcon />
            </AuthIcon>
            Logout
          </AuthButton>
        </BottomDiv>
      </StyledDiv>
    )
  }
}

const mapStateToProps = state => {
  return {
    mainColor: state.config.mainColor,
    user: state.auth.user,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSettingsToggle: showSettings => dispatch(toggleSettings(showSettings)),
    onPwdReset: () => dispatch(resetPassword()),
    onSignOut: () => dispatch(signOut()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings)
