import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
// Local Sample Data
import CustomTableCell from "./CustomTableCell";
import Typography from '@material-ui/core/Typography';

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
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        overflowX: "auto",
    },
    container: {
        maxHeight: "83vh",
        marginTop: theme.spacing(2),
    },
    table: {
        minWidth: 650,
    },
    selectTableCell: {
        width: 60,
    },
    buttonGroup: {
        marginBottom: theme.spacing(1),
    },
    header: {
        fontSize: "1.5rem"
    },
    bottomSection:{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    warn: {
      color: "#cc5500",
      backgroundColor: "#FFF4E5",
      borderRadius: "5px",
      height: "5rem",
      fontSize: "2rem",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "30rem"
    }
}));

function ResultTable({list}) {
    const classes = useStyles();

    //console.log("list", list)

    return (
        <Paper className={classes.root}>
            <Typography className={classes.header}>Result Table</Typography>
            <TableContainer className={classes.container}>
                <Table
                    className={classes.table}
                    stickyHeader
                    aria-label="sticky table"
                    size="small"
                >
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">Id</StyledTableCell>
                            <StyledTableCell align="center">Status</StyledTableCell>
                            <StyledTableCell align="center">Supplier</StyledTableCell>
                            <StyledTableCell align="center">Created Data</StyledTableCell>
                            <StyledTableCell align="center">Created Tsz</StyledTableCell>
                            <StyledTableCell align="center">Color</StyledTableCell>
                            <StyledTableCell align="center">Length</StyledTableCell>
                            <StyledTableCell align="center">Buyer</StyledTableCell>
                            <StyledTableCell align="center">Item Index</StyledTableCell>
                            <StyledTableCell align="center">Size</StyledTableCell>
                            <StyledTableCell align="center">Start</StyledTableCell>
                            <StyledTableCell align="center">QTY</StyledTableCell>
                            <StyledTableCell align="center">SKU</StyledTableCell>
                            <StyledTableCell align="center">Type</StyledTableCell>
                            <StyledTableCell align="center">Transaction</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list?.map((row) => (
                            <StyledTableRow key={row.id}>
                                <CustomTableCell {...{ row, name: "id" }} />
                                <CustomTableCell {...{ row, name: "status" }} />
                                <CustomTableCell {...{ row, name: "supplier" }} />
                                <CustomTableCell {...{ row, name: "created_date" }} />
                                <CustomTableCell {...{ row, name: "creation_tsz" }} />
                                <CustomTableCell {...{ row, name: "color" }} />
                                <CustomTableCell {...{ row, name: "length" }} />
                                <CustomTableCell {...{ row, name: "buyer" }} />
                                <CustomTableCell {...{ row, name: "item_index" }} />
                                <CustomTableCell {...{ row, name: "size" }} />
                                <CustomTableCell {...{ row, name: "start" }} />
                                <CustomTableCell {...{ row, name: "qty" }} />
                                <CustomTableCell {...{ row, name: "sku" }} />
                                <CustomTableCell {...{ row, name: "type" }} />
                                <CustomTableCell {...{ row, name: "transaction" }} />
                            </StyledTableRow>
                        )) }
                    </TableBody>
                </Table>
            </TableContainer>
            {list === undefined || list.length === 0 ? <div colSpan="2" className={classes.bottomSection}><h1 className={classes.warn}>Nothing Found</h1></div> : null} 
        </Paper>
    );
}

export default ResultTable;
