import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

import { toggleSnackbarClosed } from './actions/navigationActions'

class ErrorBar extends PureComponent {
  render() {
    const { showSnackBar, errorMessage, toggleSnackbarClosed } = this.props
    return (
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={showSnackBar}
        onClose={toggleSnackbarClosed}
        autoHideDuration={5000}
        message={<span id="message-id">{errorMessage}</span>}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={toggleSnackbarClosed}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    showSnackBar: state.content.showSnackBar,
    errorMessage: state.content.errorMessage,
  }
}
const mapDispatchToProps = {
  toggleSnackbarClosed: toggleSnackbarClosed,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorBar)
