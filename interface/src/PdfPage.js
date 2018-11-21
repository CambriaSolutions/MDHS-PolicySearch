import React, { PureComponent } from 'react'
// import { Document, Page } from 'react-pdf/dist/entry.webpack'
import { pdfjs, Document, Page } from 'react-pdf'
import CircularProgress from '@material-ui/core/CircularProgress'
import styled from 'styled-components'
import throttle from 'lodash/throttle'
import './styles/PdfPage.css'

// This is necessary because of this issue:
// https://github.com/wojtekmaj/react-pdf/issues/280#issuecomment-427484430
pdfjs.GlobalWorkerOptions.workerSrc =
  process.env.PUBLIC_URL + '/pdf.worker.min.js'

// Shim to support SVG functionality that was removed from browsers
SVGElement.prototype.getTransformToElement =
  SVGElement.prototype.getTransformToElement ||
  function(elem) {
    return elem
      .getScreenCTM()
      .inverse()
      .multiply(this.getScreenCTM())
  }

// Get an array of the start and end locations of every instance of a substring within a string
function getIndicesOf(searchStr, str, caseSensitive = false) {
  const searchStrLen = searchStr.length
  if (searchStrLen === 0) {
    return []
  }
  let startIndex = 0
  let index
  let indices = []

  if (!caseSensitive) {
    str = str.toLowerCase()
    searchStr = searchStr.toLowerCase()
  }
  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
    indices.push({
      start: index,
      end: index + searchStr.length + 1,
    })
    startIndex = index + searchStrLen
  }
  return indices
}

const Container = styled.div`
  position: relative;
`

const Spinner = styled(CircularProgress)`
  && {
    color: rgb(3, 155, 229);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
`

class PdfPage extends PureComponent {
  constructor(props) {
    super(props)
    this.containerRef = React.createRef()
    this.throttledResize = throttle(this.handleResize, 200)
    this.state = {
      containerWidth: 0,
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.highlightWords !== this.props.highlightWords) {
      this.highlightKeywords()
    }
  }

  handleResize = () => {
    if (this.containerRef.current === null) {
      return
    } else {
      const rect = this.containerRef.current.getBoundingClientRect()
      const width = rect.width
      this.setState({
        containerWidth: width,
      })
    }
  }

  componentDidMount() {
    this.handleResize()
    window.addEventListener('resize', this.throttledResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.throttledResize)
  }

  highlightKeywords = () => {
    const { highlightWords } = this.props
    const svgClassName = 'react-pdf__Page__svg'

    // Get primary SVG container
    const pageElement = document.getElementsByClassName(svgClassName)[0]
    if (!pageElement) {
      return
    }
    const masterSvg = pageElement.querySelectorAll('svg')[0]

    // SVGs are broken down as follows:
    // svg
    // - svg g (group)
    // -- svg text (text container)
    // --- svg tspan (individual characters)
    // We want each of the individual tspans
    const textElements = pageElement.querySelectorAll('svg tspan')
    const containsKeywords = new RegExp(highlightWords.join('|'))

    // Remove any existing rects before generating new ones. This allows toggling the
    // highlight chips and having the highlighted words update on the page.
    const rects = pageElement.querySelectorAll('rect')
    rects.forEach(rect => {
      rect.remove()
    })

    textElements.forEach(element => {
      const text = element.innerHTML.toLowerCase()
      // If there are words to highlight and the current tspan contains those keywords
      if (highlightWords.length > 0 && containsKeywords.test(text)) {
        // We split the text into an array containing each individual character.
        // For each character, we find the 'x' attribute from the tspan and create
        // a simple object mapping the 'x' location to the character:
        // { letter: 'a', x: '100.552' }
        // This allows us to know the location of every letter inside the tspan.
        // We have to do this because SVGs have no white space, so we need to figure
        // out where the word breaks are.
        const textArray = text.split('')
        const xCoords = element.getAttribute('x').split(' ')
        if (textArray.length !== xCoords.length) {
          return
        }
        let letterCoords = []
        for (let i in textArray) {
          letterCoords.push({
            letter: textArray[i],
            x: xCoords[i],
          })
        }

        // Repeat for each word to be highlighted
        highlightWords.forEach(word => {
          // Get the start and end index for each highlight word (substring) within the tspan's text
          const indeces = getIndicesOf(word, text)
          // For each word index within the tspan (there could be multiple instances of a word in each)
          indeces.forEach(index => {
            // Select all of the coordinate locations for the letters identified as part of that word
            const segment = letterCoords.slice(index.start, index.end)
            // Calculate the start and end point (width) of the highlighted rectangle based on the
            // word's starting and ending x-coordinates
            const length = segment.length
            const highlightStart = segment[0].x
            const highlightEnd = segment[length - 1].x - segment[0].x

            const home = element
            // returns a DOMRect representing the computed tight bounding box of the tspan
            const extent = home.getExtentOfChar(0)
            // returns the width of the tspan -- don't use this, we want the width of just
            // the word to be highlighted
            // const width = home.getComputedTextLength()

            // Create a rectangle to be sized and styled as the "highlight"
            const rect = document.createElementNS(
              'http://www.w3.org/2000/svg',
              'rect'
            )
            // Set the rectangle's x/y coordinates, width, height, and style
            rect.x.baseVal.value = highlightStart //whole tspan segment: extent.x
            rect.y.baseVal.value = extent.y
            rect.width.baseVal.value = highlightEnd //whole tspan segment: width
            rect.height.baseVal.value = extent.height
            rect.style.stroke = '#fdd835'
            rect.style.fill = '#fdd835'

            // Compute all of the transformations that happen to the tspan. This
            // method travels up to the root of the SVG (masterSvg) and copies all
            // transformations necessary onto the rectangle
            const transformFromHome = home.getTransformToElement(masterSvg)
            rect.transform.baseVal.appendItem(
              rect.transform.baseVal.createSVGTransformFromMatrix(
                transformFromHome
              )
            )
            // Insert the rect BEFORE anything else. There is no z-index in SVGs,
            // it determines precedence of display by appearance order in the DOM.
            // We want to render our rect first so that text can appear on top of it.
            masterSvg.insertBefore(rect, masterSvg.firstChild)
          })
        })
      }
    })
  }

  render() {
    const {
      className,
      pageNumber,
      currentPageUrl,
      isLoading,
      initialLoad,
    } = this.props
    const noDataTerm = initialLoad
      ? 'No results found for that query'
      : 'Enter search term'
    const loadingSpinner = <Spinner size={80} />
    console.log(currentPageUrl)
    const documentElement = (
      <Document noData={noDataTerm} file={currentPageUrl} renderMode="svg">
        <Page
          renderAnnotationLayer={false}
          renderInteractiveForms={false}
          renderTextLayer={false}
          onRenderSuccess={this.highlightKeywords}
          pageNumber={1}
          key={`pdf-main-${pageNumber}`}
          width={this.state.containerWidth}
        />
      </Document>
    )
    return (
      <Container ref={this.containerRef} className={className}>
        {isLoading ? loadingSpinner : documentElement}
      </Container>
    )
  }
}

export default PdfPage
