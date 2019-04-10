import React, { PureComponent } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
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

const TitleContainer = styled(DialogTitle)`
  && {
    padding-bottom: 10px;
  }
`

const SubTitle = styled.div`
  font-size: 13px;
  color: rgba(0, 0, 0, 0.44);
  padding-bottom: 2px;
`

const DialogTextContainer = styled.div`
  color: rgba(0, 0, 0, 0.44);
  margin-top: 10px;
  font-size: 14px;
  max-width: 300px;
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
    open: true,
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
    this.setState({ wasHelpful: null })
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
    const { wasHelpful, feedbackList } = this.state
    storeFeedback(wasHelpful, feedbackList)
    this.handleClose()
  }

  render() {
    const { wasHelpful, open, feedbackList } = this.state
    const positiveFeedback = [
      'Had the information I needed',
      'Was well written',
      'Was up-to-date',
      'Was trustworthy',
      'Was easy to navigate',
      'Searches were accurate',
    ]

    const negativeFeedback = [
      'Had too little information',
      'Had too much information',
      'Was confusing',
      'Was out-of-date',
      'Searches were not accurate',
      'Was not easy to navigate',
    ]

    const surveyGroup = wasHelpful ? positiveFeedback : negativeFeedback

    const surveyOptions = surveyGroup.map((item, key) => {
      return (
        <FormControlLabel
          key={`control-${key}`}
          control={
            <Checkbox
              key={`checkbox-${key}`}
              color="primary"
              checked={feedbackList.includes(item)}
              onChange={this.handleChange(item)}
              value={item}
            />
          }
          label={item}
        />
      )
    })

    const surveyTitle = wasHelpful ? 'I found' : 'I did not find'
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
        <Dialog open={open} onClose={this.handleClose}>
          <TitleContainer>{`${surveyTitle} Casey helpful because:`}</TitleContainer>
          <DialogContent>
            <FormControl component="fieldset">
              <SubTitle>(Check all that apply)</SubTitle>
              <FormGroup>{surveyOptions}</FormGroup>
            </FormControl>
            <DialogTextContainer>
              Your feedback is important to us and will help improve Casey.
              Thank you!
            </DialogTextContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary" autoFocus>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </OuterContainer>
    )
  }
}

export default SurveyDialog
