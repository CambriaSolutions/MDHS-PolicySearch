import React from 'react'
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

const DialogContentContainer = styled(DialogContent)`
  && {
    padding-bottom: 10px;
  }
`

const DialogTextContainer = styled.div`
  margin: 15px auto 0px;
  font-weight: 500;
  font-size: 15px;
  line-height: 20px;
  text-align: center;
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

function SurveyContent(props) {
  const {
    wasHelpful,
    open,
    feedbackList,
    handleChange,
    handleClose,
    handleSubmit,
  } = props
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
            onChange={handleChange(item)}
            value={item}
          />
        }
        label={item}
      />
    )
  })

  const surveyTitle = wasHelpful ? 'I found' : 'I did not find'

  return (
    <Dialog open={open} onClose={handleClose}>
      <TitleContainer>{`${surveyTitle} Casey helpful because:`}</TitleContainer>
      <DialogContentContainer>
        <FormControl component="fieldset">
          <SubTitle>(Check all that apply)</SubTitle>
          <FormGroup>{surveyOptions}</FormGroup>
        </FormControl>
        <DialogTextContainer>
          Your feedback is important to us and will help improve Casey. Thank
          you!
        </DialogTextContainer>
      </DialogContentContainer>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" autoFocus>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SurveyContent
