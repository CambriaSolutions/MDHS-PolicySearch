import {
  SET_SELECTED_PAGE,
  UPDATE_TEMP_PAGE_NUMBER,
  UPDATE_KEYWORDS_TO_HIGHLIGHT,
  TOGGLE_SIDEBAR_DISPLAY,
  SHOW_LOADING_SPINNER,
} from './actionTypes'

import find from 'lodash/find'
import { getStorageUrlForPage, addPageToSearchResults } from './dataActions'

export function findPageByPageNumber(pageNumber) {
  return (dispatch, getState) => {
    const currentPage = getState().content.currentPage
    if (!currentPage) {
      return
    }
    const searchResults = getState().content.searchResults
    const loadedPageData = getState().content.loadedPageData
    const allPages = [...searchResults, ...loadedPageData]
    const existingPage = find(allPages, {
      fileName: currentPage.fileName,
      pageNumber: pageNumber,
    })

    if (existingPage) {
      dispatch({
        type: SET_SELECTED_PAGE,
        page: existingPage,
      })
    } else {
      getStorageUrlForPage(currentPage.fileName, pageNumber).then(data => {
        const newPage = Object.assign(
          {},
          currentPage,
          { pageNumber: pageNumber },
          data
        )
        dispatch(addPageToSearchResults(newPage))
        dispatch(setSelectedPage(newPage))
      })
    }
  }
}

export function setSelectedPage(page) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_SELECTED_PAGE,
      page: page,
    })
  }
}

export function updateTempPageNumber(pageNumber) {
  return {
    type: UPDATE_TEMP_PAGE_NUMBER,
    pageNumber,
  }
}

export function updateKeyWordsToHighlight(keywordToToggle) {
  return {
    type: UPDATE_KEYWORDS_TO_HIGHLIGHT,
    keywordToToggle,
  }
}

export function incrementPageNumber() {
  return (dispatch, getState) => {
    const currentPage = getState().content.currentPage
    if (!currentPage) {
      return
    }
    const currentPageNum = parseInt(currentPage.pageNumber, 10)
    // TODO -- figure out how to get numPages
    // const newPageNum = Math.min(currentPage.pageNumber + 1, state.numPages)
    const newPageNum = currentPageNum + 1

    const searchResults = getState().content.searchResults
    const loadedPageData = getState().content.loadedPageData
    const allPages = [...searchResults, ...loadedPageData]
    const existingPage = find(allPages, {
      fileName: currentPage.fileName,
      pageNumber: newPageNum,
    })

    if (existingPage) {
      dispatch({
        type: SET_SELECTED_PAGE,
        page: existingPage,
      })
    } else {
      getStorageUrlForPage(currentPage.fileName, newPageNum).then(data => {
        if (data.pdfUrl === '') {
          return
        }
        const newPage = Object.assign(
          {},
          currentPage,
          { pageNumber: newPageNum },
          data
        )

        dispatch(addPageToSearchResults(newPage))
        dispatch({
          type: SET_SELECTED_PAGE,
          page: newPage,
        })
      })
    }
  }
}

export function decrementPageNumber() {
  return (dispatch, getState) => {
    const currentPage = getState().content.currentPage
    if (!currentPage) {
      return
    }
    const currentPageNum = parseInt(currentPage.pageNumber, 10)
    const newPageNum = Math.max(currentPageNum - 1, 1)

    const searchResults = getState().content.searchResults
    const loadedPageData = getState().content.loadedPageData
    const allPages = [...searchResults, ...loadedPageData]
    const existingPage = find(allPages, {
      fileName: currentPage.fileName,
      pageNumber: newPageNum,
    })

    if (existingPage) {
      dispatch({
        type: SET_SELECTED_PAGE,
        page: existingPage,
      })
    } else {
      getStorageUrlForPage(currentPage.fileName, newPageNum).then(data => {
        const newPage = Object.assign(
          {},
          currentPage,
          { pageNumber: newPageNum },
          data
        )

        dispatch(addPageToSearchResults(newPage))
        dispatch({
          type: SET_SELECTED_PAGE,
          page: newPage,
        })
      })
    }
  }
}

export function toggleSidebarDisplay() {
  return {
    type: TOGGLE_SIDEBAR_DISPLAY,
  }
}

export function showLoadingSpinner() {
  return (dispatch, getState) => {
    dispatch({
      type: SHOW_LOADING_SPINNER,
      isLoading: true,
    })
  }
}
