import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../store/actions/index'
import Search from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField'

function DocumentFilter(props) {
    const { filterPhrase, onFilterChange } = props

    return (
        <TextField
            id="input-with-icon-textfield"
            label="Filter"
            defaultValue={filterPhrase}
            onChange={onFilterChange}
            fullWidth={true}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Search />
                    </InputAdornment>
                ),
            }}
        />
    )
}


const mapDispatchToProps = dispatch => {
    return {
        onFilterChange: (e) => dispatch(actions.filterDocuments(e.target.value))        
    }
}

const mapStateToProps = state => {
    return {
        filterPhrase: state.document.filterPhrase
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DocumentFilter)