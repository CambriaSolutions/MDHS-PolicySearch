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

class SurveyContentHook extends PureComponent {
  render() {
    const { wasHelpful, open, feedbackList } = this.props

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
              onChange={this.props.handleChange(item)}
              value={item}
            />
          }
          label={item}
        />
      )
    })

    const surveyTitle = wasHelpful ? 'I found' : 'I did not find'

    return (
      <Dialog open={open} onClose={this.props.handleClose}>
        <TitleContainer>{`${surveyTitle} Casey helpful because:`}</TitleContainer>
        <DialogContent>
          <FormControl component="fieldset">
            <SubTitle>(Check all that apply)</SubTitle>
            <FormGroup>{surveyOptions}</FormGroup>
          </FormControl>
          <DialogTextContainer>
            Your feedback is important to us and will help improve Casey. Thank
            you!
          </DialogTextContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.props.handleSubmit} color="primary" autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

class SurveyContent extends PureComponent {
  render() {
    const { wasHelpful, open, feedbackList } = this.props

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
              onChange={this.props.handleChange(item)}
              value={item}
            />
          }
          label={item}
        />
      )
    })

    const surveyTitle = wasHelpful ? 'I found' : 'I did not find'

    return (
      <Dialog open={open} onClose={this.props.handleClose}>
        <TitleContainer>{`${surveyTitle} Casey helpful because:`}</TitleContainer>
        <DialogContent>
          <FormControl component="fieldset">
            <SubTitle>(Check all that apply)</SubTitle>
            <FormGroup>{surveyOptions}</FormGroup>
          </FormControl>
          <DialogTextContainer>
            Your feedback is important to us and will help improve Casey. Thank
            you!
          </DialogTextContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.props.handleSubmit} color="primary" autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default SurveyContent
