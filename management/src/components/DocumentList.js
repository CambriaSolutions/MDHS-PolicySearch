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
import styled from 'styled-components';
import DocumentUpload from './DocumentUpload'
import CircularProgress from '@material-ui/core/CircularProgress'
import Box from '@material-ui/core/Box';
import DocumentFilter from './DocumentFilter'

const StyledCellContent = styled.div`
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
`

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: "#3a8bc9",
        color: theme.palette.common.white,
        fontFamily: "Helvetica",
        fontSize: 16
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(even)': {
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
    const { documents, deleteDocument, isWorking } = props
    const classes = useStyles();

    let tableRows
    if (documents && documents.length > 0) {
        let hasResults = false
        tableRows = documents.map((row) => {
            if (row.isVisible) {
                if (!hasResults) {
                    hasResults = true
                }

                row.processingStatus = row.processingStatus || 'N/A'
                const isProcessing = (row.processingStatus !== 'complete' && row.processingStatus !== 'failure')

                return (
                    <StyledTableRow key={row.name}>
                        <StyledTableCell component="th" scope="row"><a href={row.downloadUrl} download={row.name} target='_blank' rel='noopener noreferrer'>{row.name}</a></StyledTableCell>
                        <StyledTableCell align="right">{row.timeCreated}</StyledTableCell>
                            <StyledTableCell align="center">
                                <StyledCellContent>
                                    {isProcessing && (<CircularProgress size={20} />)}
                                    &nbsp;
                                    {row.processingStatus.toUpperCase()}
                            </StyledCellContent>
                        </StyledTableCell>
                        <StyledTableCell align="right">
                            <label htmlFor="icon-button-file">
                                <IconButton aria-label="delete document" component="span" onClick={() => { deleteDocument(row.name) }} disabled={isWorking || isProcessing} >
                                    <Delete />
                                </IconButton>
                            </label>
                        </StyledTableCell>
                    </StyledTableRow>
                )
            } else {
                return null
            }
        })

        if (!hasResults) {
            tableRows = (
                <StyledTableRow key={'noresults'}>
                    <StyledTableCell colSpan={4} align="center">No Results</StyledTableCell>
                </StyledTableRow>
            )
        }
    } else {
        tableRows = (
            <StyledTableRow key={'loading'}>
                <StyledTableCell colSpan={4} align="center"><CircularProgress /></StyledTableCell>
            </StyledTableRow>
        )
    }

    return (
        <div>
            <div style={{ width: '100%' }}>
                <Box display="flex" flexDirection="row" justifyContent="flex-end" p={1} m={1}>
                    <Box flexGrow={1}>
                        <DocumentFilter />
                    </Box>
                    <Box>
                        <DocumentUpload />
                    </Box>
                </Box>
            </div>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Document Name</StyledTableCell>
                            <StyledTableCell align="right">Uploaded On</StyledTableCell>
                            <StyledTableCell align="center">Processing Status</StyledTableCell>
                            <StyledTableCell align="right">Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableRows}
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
        documents: state.document.documents,
        isWorking: state.document.isWorking,
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DocumentList)