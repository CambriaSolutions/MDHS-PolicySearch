import React from 'react';
import * as actions from '../store/actions/index'
import { connect } from 'react-redux'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import DocumentUpload from './DocumentUpload'

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});

function DocumentList(props) {
    const { documents, deleteDocument, isDeleting } = props
    const classes = useStyles();

    return (
        <div>
            <DocumentUpload />        
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Document Name</StyledTableCell>
                            <StyledTableCell align="right">Uploaded On</StyledTableCell>
                            <StyledTableCell align="right">Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {documents.map((row) => (
                            <StyledTableRow key={row.name}>
                                <StyledTableCell component="th" scope="row">{row.name}</StyledTableCell>
                                <StyledTableCell align="right">{row.timeCreated}</StyledTableCell>
                                <StyledTableCell align="right">
                                <label htmlFor="icon-button-file">
                                    <IconButton aria-label="delete document" component="span" onClick={() => { deleteDocument(row.name) }} disabled={isDeleting} >
                                        <Delete />
                                    </IconButton>
                                </label>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

const mapDispatchToProps = dispatch => {
    return {
        deleteDocument: (name) => dispatch(actions.deleteDocument(name)),
    }
}

const mapStateToProps = state => {
    return {
        isListing: state.document.isListing,
        documents: state.document.documents,
        isDeleting: state.document.isDeleting,
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DocumentList)