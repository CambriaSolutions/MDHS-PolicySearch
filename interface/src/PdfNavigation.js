import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import Input from '@material-ui/core/Input'
import get from 'lodash/get'
import isFinite from 'lodash/isFinite'
import grey from '@material-ui/core/colors/grey'

import {
  incrementPageNumber,
  decrementPageNumber,
  updateTempPageNumber,
  findPageByPageNumber,
} from './actions/navigationActions'

const OuterContainer = styled.div`
  padding: 16px;
  height: 56px;
  color: rgba(0, 0, 0, 0.54);
  font-size: 14px;
  background: ${grey[100]};
  box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12) inset;
  display: flex;
  flex-flow: row nowrap;
`

const NavigationContainer = styled.div`
  width: 100%;
  height: 100%;
  font-size: 14px;
  background: ${grey[100]};
  display: flex;
  flex-flow: row nowrap;
  position: relative;
  align-items: center;
`
const PdfName = styled.div`
  flex: 1;
  font-size: 14px;
  line-height: 24px;
`

const PageNumberElements = styled.div`
  display: flex;
  align-items: center;
  position: right;
`

const StyledInput = styled(Input)`
  && {
    width: 32px;
    border: 1px solid lightgrey;
    margin-right: 3px;
    background: white;
    font-size: 13px;
    & > input {
      padding: 4px 0;
      text-align: center;
    }
  }
`
const NavLeft = styled(ChevronLeft)`
  && {
    cursor: pointer;
  }
`
const NavRight = styled(ChevronRight)`
  && {
    cursor: pointer;
  }
`

class PdfNavigation extends PureComponent {
  constructor(props) {
    super(props)
    this.wrapperRef = React.createRef()
  }

  componentDidMount = () => {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  handleClickOutside = e => {
    if (!this.wrapperRef || this.wrapperRef.current === null) {
      return
    }
    if (this.wrapperRef && !this.wrapperRef.current.contains(e.target)) {
      this.submitPageNumberChange()
    }
  }

  handleInputChange = e => {
    // Only allow numbers in the input box in order to accomodate for
    // removing type="number" to type="text". We did this to remove the
    // scroll arrow from firefox styling.
    if (isFinite(parseInt(e.target.value, 10)) || e.target.value === '') {
      let pageNumber = e.target.value === '' ? '' : e.target.value
      this.props.onEditPageNumber(pageNumber)
    }
  }

  submitPageNumberChange = () => {
    this.props.onSubmitSearch(this.props.tempEditingPageNumber)
  }

  checkIfKeyEnter = e => {
    if (e.key === 'Enter') {
      this.submitPageNumberChange()
    }
  }

  render() {
    const {
      currentPage,
      onPrevPageClick,
      onNextPageClick,
      tempEditingPageNumber,
      documentMetadata,
    } = this.props
    const fileName = get(currentPage, 'fileName', '').replace(/\.[^/.]+$/, '')
    const description = fileName ? `${fileName}` : 'No PDF Selected'
    let maxPageNumber = 0
    const filteredMetadata = documentMetadata.filter(
      document => document.id === fileName
    )
    if (filteredMetadata.length > 0) {
      maxPageNumber = get(filteredMetadata, '[0].totalPages', 0)
    }
    return (
      <OuterContainer ref={this.wrapperRef}>
        <NavigationContainer>
          <PdfName>{description}</PdfName>
          <PageNumberElements>
            <NavLeft onClick={onPrevPageClick} />
            <StyledInput
              margin="dense"
              type="text"
              value={tempEditingPageNumber}
              onChange={this.handleInputChange}
              onKeyPress={this.checkIfKeyEnter}
              disableUnderline
              autoFocus
            />
            of {maxPageNumber}
            <NavRight onClick={onNextPageClick} />
          </PageNumberElements>
        </NavigationContainer>
      </OuterContainer>
    )
  }
}

// Translate the Redux's store into a component's props.
const mapStateToProps = state => {
  return {
    currentPage: state.content.currentPage,
    pageNumber: state.content.selectedPageNumber,
    tempEditingPageNumber: state.content.tempEditingPageNumber,
    documentMetadata: state.config.documentMetadata,
  }
}

const mapDispatchToProps = {
  onSubmitSearch: findPageByPageNumber,
  onNextPageClick: incrementPageNumber,
  onPrevPageClick: decrementPageNumber,
  onEditPageNumber: updateTempPageNumber,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PdfNavigation)
