import React from 'react'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import { withTheme } from '@material-ui/core/styles'
import FilledInput from '@material-ui/core/FilledInput'
import styled from 'styled-components'

const SearchBox = styled(FilledInput)`
  && {
    border: none;
    border-radius: 22px;
    height: 44px;
    min-height: 44px;
    max-width: 1200px;
    margin: auto auto;
    > input {
      padding: 12px 12px 12px 0;
    }
    &::before {
      display: none;
    }
    &::after {
      display: none;
    }
  }
`
function MyComponent(props) {
  return (
    <SearchBox
      fullWidth
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

export default withTheme()(MyComponent)
