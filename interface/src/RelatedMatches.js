import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import orderBy from 'lodash/orderBy'
import grey from '@material-ui/core/colors/grey'
import styled from 'styled-components'
import RelatedMatch from './RelatedMatch'

const Container = styled.div`
  padding-top: 10px;
  flex: 1 0 250px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
  overflow: auto;
  height: 100vh;

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

class RelatedMatches extends PureComponent {
  render() {
    const { searchResults, currentPage } = this.props
    const sortedMatches = orderBy(searchResults, 'score', 'desc')

    const pages = sortedMatches.map(page => {
      return (
        <RelatedMatch
          page={page}
          key={`sidebar-pg-${page.thumbUrl}`}
          active={page === currentPage}
        />
      )
    })

    // Old methodology for enabling sections.
    // Not currently in use because we only care about page numbers

    // const groupedMatches = groupBy(sortedMatches, 'section')
    // let sections = []
    // for (let section in groupedMatches) {
    //   const pages = groupedMatches[section].map((page, key) => {
    //     return (
    //       <RelatedMatch
    //         key={`sidebar-pg-${page.pageNumber}`}
    //         pageNumber={page.pageNumber}
    //         active={selectedPageNumber === page.pageNumber}
    //       />
    //     )
    //   })
    //   const sectionContent = (
    //     <Section
    //       key={`sidebar-section-${section}`}
    //       open={sideBarOpen}
    //       section={section}
    //       pages={pages}
    //     />
    //   )
    //   sections.push(sectionContent)
    // }

    return <Container>{pages}</Container>
  }
}

const mapStateToProps = state => {
  return {
    searchResults: state.content.searchResults,
    currentPage: state.content.currentPage,
  }
}

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RelatedMatches)
