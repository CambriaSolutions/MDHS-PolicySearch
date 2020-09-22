import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../store/actions/index'
import styled from 'styled-components'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CloudUpload from '@material-ui/icons/CloudUpload';
import CircularProgress from '@material-ui/core/CircularProgress'

const FormContainer = styled.form`
  width: 100%;
  margin: 8px;
  text-align: right;
`

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    input: {
        display: 'none',
    },
}));

function DocumentUpload(props) {
    const { onDocumentUpload, isUploading } = props
    const classes = useStyles();

    const uploadText = isUploading ? 'Uploading' : 'Upload'

    return (
        <FormContainer>
            <div className={classes.root}>
                <input
                    accept="application/pdf"
                    className={classes.input}
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={onDocumentUpload}
                />
                <label htmlFor="contained-button-file">
                    <Button variant="contained" color="primary" component="span" disabled={isUploading}>
                        {uploadText}
                        &nbsp;
                        {isUploading ? (<CircularProgress size={20} />) : (<CloudUpload />)}
                    </Button>
                </label>
            </div>
        </FormContainer>
    )
}


const mapDispatchToProps = dispatch => {
    return {
        onDocumentUpload: (e) => dispatch(actions.uploadDocument(e.target.files[0]))
    }
}

const mapStateToProps = state => {
    return {
        isUploading: state.document.isUploading
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DocumentUpload)