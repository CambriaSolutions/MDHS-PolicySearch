import * as t from '../actions/actionTypes'

const initialState = {
  selectedPageNumber: 1,
  tempEditingPageNumber: 1,
  keywords: [],
  highlights: [],
  keywordsToHighlight: [],
  searchResults: [],
  loadedPageData: [],
  sideBarOpen: true,
  isLoading: false,
  showSnackBar: false,
  errorMessage: '',
  documentDownloadUrls: [],
}

function content(state = initialState, action) {
  switch (action.type) {
    case t.ADD_PAGE_TO_SEARCH_RESULTS:
      return {
        ...state,
        loadedPageData: [...state.loadedPageData, action.page],
      }

    case t.UPDATE_MATCH_DATA:
      return {
        ...state,
        searchResults: action.pages,
        keywords: action.keywords,
        highlights: action.highlights,
        keywordsToHighlight: action.keywords,
        currentPage: action.bestPage,
        tempEditingPageNumber: action.bestPage.pageNumber,
        selectedPageNumber: action.bestPage.pageNumber,
      }

    // Decrement the page number, but not below the first page
    // case t.DECREMENT_PAGE_NUMBER:
    //   const prevPage = Math.max(state.selectedPageNumber - 1, 1)
    //   return {
    //     ...state,
    //     tempEditingPageNumber: prevPage,
    //     selectedPageNumber: prevPage,
    //   }
    case t.SHOW_LOADING_SPINNER:
      return {
        ...state,
        isLoading: action.isLoading,
      }

    case t.SET_SELECTED_PAGE:
      return {
        ...state,
        currentPage: action.page,
        tempEditingPageNumber: action.page.pageNumber,
        selectedPageNumber: action.page.pageNumber,
      }

    case t.UPDATE_TEMP_PAGE_NUMBER:
      return {
        ...state,
        tempEditingPageNumber: action.pageNumber,
      }

    case t.TOGGLE_SIDEBAR_DISPLAY:
      const isSideBarOpen = !state.sideBarOpen
      return {
        ...state,
        sideBarOpen: isSideBarOpen,
      }

    case t.UPDATE_KEYWORDS_TO_HIGHLIGHT:
      const keywordToToggle = action.keywordToToggle
      const currentKeywords = state.keywordsToHighlight
      let updatedKeywordsList = []

      // check to see if selected word is part of keywords to highlight
      const keywordInList = currentKeywords.includes(keywordToToggle)

      // if yes, make a new array of keywords without the selected keyword
      if (keywordInList) {
        updatedKeywordsList = currentKeywords.filter(keyword => {
          return keyword !== keywordToToggle
        })
      }

      // if no, make a new array of keywords with the selected keyword
      else {
        updatedKeywordsList = [...currentKeywords, keywordToToggle]
      }

      return { ...state, keywordsToHighlight: updatedKeywordsList }

    case t.TOGGLE_SNACKBAR_OPEN:
      const errorMessage = action.message
      return {
        ...state,
        errorMessage: errorMessage,
        showSnackBar: true,
      }

    case t.TOGGLE_SNACKBAR_CLOSED:
      return {
        ...state,
        errorMessage: '',
        showSnackBar: false,
      }

    case t.SET_DOWNLOAD_URL:
      const downloadURLData = action.downloadURLData
      const currentdocumentDownloadUrls = state.documentDownloadUrls

      return {
        ...state,
        documentDownloadUrls: [...currentdocumentDownloadUrls, downloadURLData],
      }

    default:
      return state
  }
}

export default content
