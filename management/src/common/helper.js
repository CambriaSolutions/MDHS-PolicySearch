// Lighten/Darken colors
export const colorShades = (col, amt) => {
  // amt + equals lighter
  // amt - equals darker
  let usePound = false
  if (col[0] === '#') {
    col = col.slice(1)
    usePound = true
  }

  const num = parseInt(col, 16)
  var r = (num >> 16) + amt

  if (r > 255) r = 255
  else if (r < 0) r = 0

  var b = ((num >> 8) & 0x00ff) + amt
  if (b > 255) b = 255
  else if (b < 0) b = 0

  var g = (num & 0x0000ff) + amt
  if (g > 255) g = 255
  else if (g < 0) g = 0

  return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16)
}

// Separate string into smaller pieces
export const chunkString = (str, size) => {
  //let chunks = [];
  let spacePieces = str.split(' ')
  return spacePieces.reduce(
    (chunks, piece, index) => {
      let isFirstPiece = index === 0
      //let isLastPiece = index === spacePieces.length - 1;

      let chunkSeparator = isFirstPiece ? '' : ' '
      let currentChunk = chunks[chunks.length - 1]
      // If a piece is simply too long, split it up harshly
      if (piece.length > size) {
        // Add whatever we can to the current
        let startingPieceIndex = size - (chunkSeparator + currentChunk).length
        currentChunk += chunkSeparator + piece.substring(0, startingPieceIndex)
        chunks[chunks.length - 1] = currentChunk

        // Then just add the rest to more chunks
        let leftover = piece.substring(startingPieceIndex)
        for (let i = 0; i < leftover.length; i += size) {
          chunks.push(leftover.substring(i, i + size))
        }
      }
      // Otherwise try to split nicely at spaces
      else if ((currentChunk + chunkSeparator + piece).length <= size) {
        currentChunk += chunkSeparator + piece
        chunks[chunks.length - 1] = currentChunk
      }
      // If we simply reached max for this chunk, move to the next one
      else {
        currentChunk = piece
        chunks.push('')
        chunks[chunks.length - 1] = currentChunk
      }

      return chunks
    },
    ['']
  )
}

export const convertHex = (hex, opacity) => {
  hex = hex.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16),
    g = parseInt(hex.substring(2, 4), 16),
    b = parseInt(hex.substring(4, 6), 16)

  return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')'
}

export const getUTCDate = (dateString = Date.now(), timezoneOffset = -7) => {
  const date = new Date(dateString)

  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours() + timezoneOffset,
    date.getUTCMinutes(),
    date.getUTCSeconds()
  )
}

export const contrastingColors = colors => {
  let darkest;
  let darkestColorAverage = parseInt(Number('0xFF'), 10)
  let lightest
  let lightestColorAverage = 0

  colors.forEach(color => {
    const colorAverage = (parseInt(Number(`0x${color.slice(1, 3)}`), 10) + parseInt(Number(`0x${color.slice(3, 5)}`), 10) + parseInt(Number(`0x${color.slice(5, 7)}`), 10)) / 3
    if (colorAverage < darkestColorAverage) {
      darkest = color;
      darkestColorAverage = colorAverage
    }
    if (colorAverage > lightestColorAverage) {
      lightest = color;
      lightestColorAverage = colorAverage
    }
  })

  return [darkest, lightest]
};
