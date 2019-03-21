import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import Paper from '@material-ui/core/Paper'
import Chip from '@material-ui/core/Chip'
import styled from 'styled-components'
// import mdhsLogo from './img/mdhs_logo.png'
import { updateKeyWordsToHighlight } from './actions/navigationActions'
import ExtendedKeywords from './ExtendedKeywords'
import Typography from '@material-ui/core/Typography'

const Summary = styled(Paper)`
  && {
    width: 100%;
    overflow: hidden;
    background: #262f3d;
    display: flex;
    flex-flow: column nowrap;
    font-size: 14px;
    font-weight: 500;
    -webkit-font-smoothing: antialiased;
  }
`
const LogoBar = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  padding: ${p => (p.sideBarOpen ? '16px 24px' : '12px')};
  min-height: 48px;
  font-family: 'Google Sans', sans-serif;
`
const MatchBar = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  padding: 12px 24px;
  justify-content: flex-start;
  align-items: center;
  text-transform: capitalize;
`
const KeywordsContainer = styled.div`
  flex: 1 0 auto;
  width: 100%;
  padding: 12px 24px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-flow: column nowrap;
`
const Divider = styled.div`
  width: 100%;
  height: 1px;
  flex: 1 0 auto;
  min-height: 1px;
  max-height: 1px;
  background: rgb(64, 72, 84);
`

const Header = styled(Typography)`
  && {
    flex: 1 0 28px;
    max-height: 28px;
    line-height: 28px;
    color: rgba(255, 255, 255, 0.7);
    width: 100%;
  }
`

const LogoHeader = styled(Header)`
  && {
    color: #fff;
    font-family: 'Google Sans', 'sans-serif';
  }
`
const SmallLogoHeader = styled(LogoHeader)`
  && {
  }
`

const ChipArray = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  flex: 1;
  padding-top: 8px;
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

class MatchSummary extends PureComponent {
  handleClick = keyword => {
    this.props.onKeywordToggle(keyword)
  }

  render() {
    const {
      keywords,
      keywordsToHighlight,
      searchResults,
      sideBarOpen,
    } = this.props
    const numMatches = Object.keys(searchResults).length

    const keywordChips = keywords.map(keyword => {
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

    return (
      <Summary elevation={2}>
        <LogoBar sideBarOpen={sideBarOpen}>
          {/* <Logo src={mdhsLogo} alt={'MDHS'} /> */}
          {sideBarOpen ? (
            <LogoHeader variant="h6">Search Results</LogoHeader>
          ) : (
            <SmallLogoHeader variant="subtitle2">Results</SmallLogoHeader>
          )}
        </LogoBar>
        <Divider />
        {sideBarOpen ? (
          <React.Fragment>
            <KeywordsContainer>
              <Header variant="subtitle2">Keywords</Header>
              {keywordChips.length > 0 ? (
                <ChipArray>{keywordChips}</ChipArray>
              ) : null}
            </KeywordsContainer>
            <Divider />
            <ExtendedKeywords />
            <Divider />
            <MatchBar>
              <Header variant="subtitle2">{numMatches} matches</Header>
            </MatchBar>
          </React.Fragment>
        ) : null}
      </Summary>
    )
  }
}

const mapStateToProps = state => {
  return {
    sideBarOpen: state.content.sideBarOpen,
    keywords: state.content.keywords,
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
