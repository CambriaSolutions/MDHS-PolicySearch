import React from 'react'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import FilledInput from '@material-ui/core/FilledInput'
import styled from 'styled-components'

const SearchBox = styled(FilledInput)`
  && {
    border: none;
    border-radius: 22px;
    height: 44px;
    min-height: 44px;
    max-width: 1200px;
    margin: auto;
    > input {
      padding: 12px 12px 12px 0;
    }
  }
`
function SearchInput(props) {
  return (
    <SearchBox
      fullWidth
      disableUnderline
      margin="dense"
      placeholder="Ask me a question!"
      type="search"
      value={props.value}
      onChange={props.onChange}
      onKeyPress={props.onKeyPress}
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      }
    />
  )
}
export default SearchInput
