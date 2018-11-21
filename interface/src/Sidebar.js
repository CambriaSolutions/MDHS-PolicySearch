import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Paper from '@material-ui/core/Paper'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import RelatedMatches from './RelatedMatches'
import MatchSummary from './MatchSummary'

import { toggleSidebarDisplay } from './actions/navigationActions'

const Container = styled.div`
  grid-area: sidebar;
  display: flex;
  flex-flow: column nowrap;
  background: #19212b;
  max-height: 100vh;
`

const BottomBar = styled(Paper)`
  && {
    display: flex;
    flex-flow: row nowrap;
    justify-content: ${p => (p.open ? 'flex-end' : 'center')};
    align-items: center;
    background: #262f3d;
    border-top: 1px solid rgb(64, 72, 84);
    border-radius: 0px;
    cursor: pointer;
    padding: 12px 24px;
    font-size: 18px;
    user-select: none;
    &:hover {
      svg {
        color: white;
      }
    }
  }
`
const ArrowLeft = styled(ChevronLeft)`
  && {
    font-size: 28px;
    display: flex;
    color: rgba(255, 255, 255, 0.7);
    transform: ${p => (p.open ? 'null' : 'rotate(180deg)')};
    transition: transform 0.2s linear;
  }
`

class Sidebar extends PureComponent {
  render() {
    const { sideBarOpen, onToggleSideBar } = this.props
    const handleClick = () => {
      onToggleSideBar()
    }

    return (
      <Container>
        <MatchSummary elevation={2} />
        <RelatedMatches />
        <BottomBar open={sideBarOpen} onClick={handleClick}>
          <ArrowLeft open={sideBarOpen} />
        </BottomBar>
      </Container>
    )
  }
}
const mapStateToProps = state => {
  return {
    sideBarOpen: state.content.sideBarOpen,
  }
}

const mapDispatchToProps = {
  onToggleSideBar: toggleSidebarDisplay,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar)
