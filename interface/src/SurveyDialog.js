import React, { PureComponent } from 'react'
import Button from '@material-ui/core/Button'
import SurveyContent from './SurveyContent'
import styled from 'styled-components'
import storeFeedback from './actions/databaseActions.js'

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

class SurveyDialog extends PureComponent {
  state = {
    open: false,
    wasHelpful: null,
    feedbackList: [],
  }

  handleClickYes = e => {
    this.setState({ wasHelpful: true })
    this.setState({ open: true })
  }

  handleClickNo = e => {
    this.setState({ wasHelpful: false })
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
    this.setState({ feedbackList: [] })
  }

  handleChange = name => () => {
    const { feedbackList } = this.state
    let newFeedbackList
    if (!feedbackList.includes(name)) {
      newFeedbackList = [...feedbackList, name]
    } else {
      newFeedbackList = feedbackList.filter(item => item !== name)
    }
    this.setState({ feedbackList: newFeedbackList })
  }

  handleSubmit = () => {
    const { feedbackList, wasHelpful } = this.state
    storeFeedback(wasHelpful, feedbackList)
    this.handleClose()
  }

  render() {
    return (
      <OuterContainer>
        <OuterTextContainer>Was Casey Helpful?</OuterTextContainer>
        <StyledButton
          variant="contained"
          size="small"
          onClick={this.handleClickYes}
        >
          Yes
        </StyledButton>
        <StyledButton
          variant="contained"
          size="small"
          onClick={this.handleClickNo}
        >
          No
        </StyledButton>
        <SurveyContent
          open={this.state.open}
          feedbackList={this.state.feedbackList}
          handleClose={this.handleClose}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          wasHelpful={this.state.wasHelpful}
        />
      </OuterContainer>
    )
  }
}

export default SurveyDialog
