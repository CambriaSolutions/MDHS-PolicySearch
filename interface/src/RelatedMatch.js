import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import Paper from '@material-ui/core/Paper'
import styled from 'styled-components'
import { setSelectedPage } from './actions/navigationActions'

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  flex: 0 1 auto;
  min-height: ${p => (p.open ? '300px' : '120px')};
  padding: ${p => (p.open ? '0 24px' : '0 12px')};
  cursor: pointer;
`

const ThumbContainer = styled(Paper)`
  && {
    width: 100%;
    flex: ${p => (p.small ? '1 0 68px' : '1 0 250px')};
    border: ${p => (p.active ? `4px solid #4fc3f7` : '4px solid transparent')}
    margin-bottom: 5px;
    & > img {
      width: 100%;
      height: 100%;
    }
  }
`

const FileName = styled.div`
  flex: ${p => (p.open ? '1 0 16px' : '1 0 12px')};
  width: 100%;
  overflow: hidden;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: ${p => (p.open ? '13px' : '11px')};
  color: rgba(255, 255, 255, 0.8);
`

const PageNumber = styled.div`
  flex: 1 0 12px;
  text-align: center;
  font-size: 11px;
  margin-bottom: ${p => (p.open ? '10px' : '5px')};
  color: rgba(255, 255, 255, 0.6);
`

class RelatedMatch extends PureComponent {
  render() {
    const { active, onContainerClick, page, sideBarOpen } = this.props
    const { pageNumber, thumbUrl, fileName } = page

    return (
      <Container open={sideBarOpen} onClick={() => onContainerClick(page)}>
        <ThumbContainer active={active ? 1 : 0} small={sideBarOpen ? 0 : 1}>
          <img src={thumbUrl} alt={`pdf-page-${pageNumber}`} />
        </ThumbContainer>
        <FileName open={sideBarOpen}>{fileName}</FileName>
        <PageNumber open={sideBarOpen}>
          {sideBarOpen ? 'Page ' : null} {pageNumber}
        </PageNumber>
      </Container>
    )
  }
}

// Translate the Redux's store into a component's props.
const mapStateToProps = state => {
  return {
    sideBarOpen: state.content.sideBarOpen,
  }
}

const mapDispatchToProps = {
  onContainerClick: setSelectedPage,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RelatedMatch)
