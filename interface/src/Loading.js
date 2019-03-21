import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import CircularProgress from '@material-ui/core/CircularProgress'
import styled from 'styled-components'
import grey from '@material-ui/core/colors/grey'
import { cancelRequest } from './actions/dataActions'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: ${grey[600]};
  margin: auto;
`
const Spinner = styled(CircularProgress)`
  && {
    color: rgb(3, 155, 229);
  }
`
const TextContainer = styled.div`
  margin-top: 25px;
  margin-bottom: 5px;
`
const CancelContainer = styled.div`
  cursor: pointer;
  border-bottom: 1px solid;
`

class Loading extends PureComponent {
  handleClick = () => {
    this.props.cancelRequest()
  }
  render() {
    return (
      <Container>
        <Spinner size={80} />
        <TextContainer>Searching document...</TextContainer>
        <CancelContainer onClick={this.handleClick}>Cancel</CancelContainer>
      </Container>
    )
  }
}

const mapDispatchToProps = {
  cancelRequest: cancelRequest,
}

export default connect(
  null,
  mapDispatchToProps
)(Loading)
