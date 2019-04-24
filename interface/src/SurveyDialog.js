import React, { useState } from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import SurveyContent from './SurveyContent'
import styled from 'styled-components'
import storeFeedback from './actions/databaseActions.js'

import { toggleSnackbarOpen } from './actions/navigationActions'

const OuterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: calc(100% - 48px);
  margin: auto;
  max-width: 1200px;
`

const OuterTextContainer = styled.div`
  margin: auto 5px;
  color: rgba(0, 0, 0, 0.44);
  font-size: 13px;
`

const StyledButton = styled(Button)`
  && {
    color: #000;
    text-transform: none;
    font-size: 10px;
    margin: 0 5px;
  }
`

function SurveyDialog(props) {
  const { toggleSnackbarOpen } = props
  const [wasHelpful, setWasHelpful] = useState(null)
  const [open, setOpen] = useState(false)
  const [feedbackList, setFeedbackList] = useState([])

  function handleClickYes() {
    setWasHelpful(true)
    setOpen(true)
  }

  function handleClickNo() {
    setWasHelpful(false)
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
    setFeedbackList([])
  }

  const handleChange = name => () => {
    let newFeedbackList
    if (!feedbackList.includes(name)) {
      newFeedbackList = [...feedbackList, name]
    } else {
      newFeedbackList = feedbackList.filter(item => item !== name)
    }
    setFeedbackList(newFeedbackList)
  }

  function handleSubmit() {
    storeFeedback(wasHelpful, feedbackList)
    toggleSnackbarOpen('Thanks for the feedback!')
    handleClose()
  }

  return (
    <OuterContainer>
      <OuterTextContainer>Was Casey Helpful?</OuterTextContainer>
      <StyledButton variant="contained" size="small" onClick={handleClickYes}>
        Yes
      </StyledButton>
      <StyledButton variant="contained" size="small" onClick={handleClickNo}>
        No
      </StyledButton>
      <SurveyContent
        open={open}
        feedbackList={feedbackList}
        handleClose={handleClose}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        wasHelpful={wasHelpful}
      />
    </OuterContainer>
  )
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = {
  toggleSnackbarOpen,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SurveyDialog)
