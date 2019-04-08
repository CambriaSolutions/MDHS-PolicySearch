import React, { PureComponent } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import styled from 'styled-components'

const OuterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: calc(100% - 48px);
  margin: auto;
  max-width: 1200px;
`

const TextContainer = styled.div`
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
    const payLoad = { wasHelpful, feedbackList }
    fetch(process.env.REACT_APP_ANALYTICS_URI, {
      method: 'POST',
      body: payLoad,
      headers: {
        'Content-Type': 'application/json',
      },
    })
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
        <TextContainer>Was Casey Helpful?</TextContainer>
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
          <DialogTitle id="alert-dialog-title">
            {`${surveyTitle} Casey helpful because:`}
          </DialogTitle>
          <DialogContent>
            <FormControl component="fieldset">
              <FormLabel>Check all that apply</FormLabel>
              <FormGroup>{surveyOptions}</FormGroup>
            </FormControl>
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
