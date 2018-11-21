import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import Chip from '@material-ui/core/Chip'
import styled from 'styled-components'
import { updateKeyWordsToHighlight } from './actions/navigationActions'
import UpArrow from '@material-ui/icons/KeyboardArrowUp'
import Typography from '@material-ui/core/Typography'
import grey from '@material-ui/core/colors/grey'

const Container = styled.div`
  width: 100%;
  padding: 12px 24px;
  display: flex;
  justify-content: flex-start;
  flex-flow: column nowrap;
  flex: 1 0 auto;
  &:hover {
    svg {
      color: white;
    }
  }
`

const HeaderBar = styled.div`
  cursor: pointer;
  user-select: none;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
`

const Header = styled(Typography)`
  && {
    padding-left: 2px;
    flex: 1 0 24px;
    max-height: 24px;
    font-size: 14px;
    line-height: 24px;
    color: rgba(255, 255, 255, 0.7);
    width: 100%;
  }
`
const ChipArray = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  overflow: ${p => (p.active === 'active' ? 'auto' : 'hidden')};
  flex: 1;
  padding-top: ${p => (p.active === 'active' ? '8px' : '0px')};
  opacity: ${p => (p.active === 'active' ? '1' : '0')};
  max-height: ${p => (p.active === 'active' ? '200px' : '0px')};
  transition: all 0.15s ease-in-out;

  ::-webkit-scrollbar {
    background: #262f3d;
    width: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: ${grey[600]};
    -webkit-border-radius: 8px;
    border-radius: 8px;
    border: 2px solid #262f3d;
  }
`

const StyledChip = styled(Chip)`
  && {
    background-color: ${props =>
      props.active === 'active' ? '#fdd835' : null};
    margin-right: 8px;
    margin-bottom: 8px;

    &:hover,
    &:focus {
      background-color: ${props =>
        props.active === 'active' ? '#fdd835' : null};
    }
  }
`

const ArrowUp = styled(UpArrow)`
  && {
    font-size: 28px;
    transform: ${p => (p.active === 'active' ? '' : 'rotate(-180deg)')};
    transition: transform 0.15s ease-in-out;
    color: rgba(255, 255, 255, 0.7);
    &:hover {
      color: white;
    }
  }
`
class MatchSummary extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
    }
  }
  toggleOpen = () => {
    this.setState({ open: !this.state.open })
  }
  handleClick = keyword => {
    this.props.onKeywordToggle(keyword)
  }

  render() {
    const { highlights, keywordsToHighlight } = this.props

    const chips = highlights.map(keyword => {
      const keywordInList = keywordsToHighlight.includes(keyword)
      return (
        <StyledChip
          label={keyword}
          active={keywordInList ? 'active' : null}
          onClick={() => this.handleClick(keyword)}
          key={`keyword-${keyword}`}
        />
      )
    })

    const showChips = chips.length > 0 && this.state.open
    return (
      <Container>
        <HeaderBar onClick={this.toggleOpen}>
          <Header>Extended Keywords</Header>
          <ArrowUp active={this.state.open ? 'active' : 'inactive'} />
        </HeaderBar>
        <ChipArray active={showChips ? 'active' : 'inactive'}>
          {chips}
        </ChipArray>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    highlights: state.content.highlights,
    keywordsToHighlight: state.content.keywordsToHighlight,
    searchResults: state.content.searchResults,
  }
}

const mapDispatchToProps = {
  onKeywordToggle: updateKeyWordsToHighlight,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatchSummary)
