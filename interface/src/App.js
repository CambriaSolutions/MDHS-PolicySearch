import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import Paper from '@material-ui/core/Paper'
import PdfPage from './PdfPage'
import PdfNavigation from './PdfNavigation'
import Sidebar from './Sidebar'
import styled from 'styled-components'
import get from 'lodash/get'
import grey from '@material-ui/core/colors/grey'
import SearchInput from './SearchInput'
import { queryCloudSearch } from './actions/dataActions'
import { showLoadingSpinner } from './actions/navigationActions'

const Container = styled.div`
  display: grid;
  grid-template-columns: ${p => (p.active ? '250px 1fr' : '85px 1fr')};
  grid-template-rows: 92px 1fr;
  grid-template-areas:
    'sidebar appbar'
    'sidebar main';
  height: 100vh;
  width: 100vw;
  max-width: 100%;
`

const Main = styled.div`
  grid-area: main;
  background: ${grey[200]};
  overflow: auto;
`

const AppBar = styled.div`
  grid-area: appbar;
  background: ${grey[200]};
  padding: 24px;
  display: flex;
  flex-flow: column nowrap;
`

const PdfContainer = styled(Paper)`
  width: calc(100% - 48px);
  height: calc(100vh - 106px - 36px);
  margin: 24px auto;
  max-width: 1200px;
  display: flex;
  flex-flow: column nowrap;
  overflow: ${p => (p.loading ? 'hidden' : 'auto')};
  & > .pdf__main {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
`

export class App extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
    }
  }
  handleSearchInput = e => {
    this.setState({ searchText: e.target.value })
  }
  catchReturn = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      this.props.queryCloudSearch(this.state.searchText)
    }
  }
  render() {
    const {
      currentPage,
      sideBarOpen,
      keywordsToHighlight,
      isLoading,
      initialLoad,
    } = this.props
    const currentPageUrl = get(currentPage, 'pdfUrl', '')
    return (
      <Container active={sideBarOpen}>
        <Sidebar />
        <AppBar>
          <SearchInput
            value={this.state.searchText}
            onKeyPress={this.catchReturn}
            onChange={this.handleSearchInput}
          />
        </AppBar>
        <Main>
          <PdfContainer elevation={1} loading={isLoading ? 1 : 0}>
            <PdfNavigation />
            <PdfPage
              className="pdf__main"
              isLoading={isLoading}
              initialLoad={initialLoad}
              currentPageUrl={currentPageUrl}
              highlightWords={keywordsToHighlight}
            />
          </PdfContainer>
        </Main>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentPage: state.content.currentPage,
    sideBarOpen: state.content.sideBarOpen,
    keywordsToHighlight: state.content.keywordsToHighlight,
    isLoading: state.content.isLoading,
    initialLoad: state.config.initialLoad,
  }
}

const mapDispatchToProps = {
  showLoadingSpinner,
  queryCloudSearch,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
