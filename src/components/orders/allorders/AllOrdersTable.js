import React, { useState, useEffect } from "react";
import axios from 'axios'
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import TableFooter from "@material-ui/core/TableFooter";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
// Local Sample Data
import DATA from "../../../helper/Data";
import TablePaginationActions from "./TablePaginationActions";
import CustomTableCell from "./CustomTableCell";

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
        marginTop: theme.spacing(3),
        overflowX: "auto",
    },
    container: {
        maxHeight: "83vh",
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
}));

function AllOrdersTable() {
    const [rows, setRows] = useState(DATA);
    const [previous, setPrevious] = useState({});
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [count, setCount] = useState(0)

    //--------------- Get Orders
    useEffect(() => {
        const myUrl = `http://144.202.67.136:8080/etsy/allordersList/?limit=${rowsPerPage}&offset=${page * rowsPerPage}`
        axios.get(myUrl)
            .then(res => {
                console.log("---------------------------");
                console.log("DATA : ", res.data);
                setRows(res.data.results)
                setCount(res.data.count)
                console.log("rowsPerPage : ", rowsPerPage);
                console.log("page", page);
                console.log("myUrl : ", myUrl);
                console.log("nex url :", res.data.next)
                console.log("---------------------------");
            }).catch(error => {
                console.log(error);
            })
    }, [page, rowsPerPage])
    //console.log("data rows : ", rows);
    //------------------------------

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const onChange = (e, row) => {
        if (!previous[row.id]) {
            setPrevious((state) => ({ ...state, [row.id]: row }));
        }
        const value = e.target.value;
        const name = e.target.name;
        const id = row?.id;
        const newRows = rows.map((row) => {
            if (row.id === id) {
                return { ...row, [name]: value };
            }
            return row;
        });
        setRows(newRows);
    };

    return (
        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <Table
                    className={classes.table}
                    stickyHeader
                    aria-label="sticky table"
                    size="small"
                >
                    <caption>Can be added Company Name!</caption>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">Receipt Id</StyledTableCell>
                            <StyledTableCell align="center">Date</StyledTableCell>
                            <StyledTableCell align="center">Buyer</StyledTableCell>
                            <StyledTableCell align="center">was_shipped</StyledTableCell>
                            <StyledTableCell align="center">seller_user_id</StyledTableCell>
                            <StyledTableCell align="center">shipped_date</StyledTableCell>
                            <StyledTableCell align="center">Acceleration</StyledTableCell>
                            <StyledTableCell align="center">Year</StyledTableCell>
                            <StyledTableCell align="center">message_from_buyer</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows?.map((row) => (
                            <StyledTableRow key={row.id}>
                                <CustomTableCell {...{ row, name: "receipt_id", onChange }} />
                                <CustomTableCell {...{ row, name: "createddate", onChange }} />
                                <CustomTableCell {...{ row, name: "buyer", onChange }} />
                                <CustomTableCell {...{ row, name: "was_shipped", onChange }} />
                                <CustomTableCell {...{ row, name: "seller_user_id", onChange }} />
                                <CustomTableCell {...{ row, name: "Weight_in_lbs", onChange }} />
                                <CustomTableCell {...{ row, name: "shipped_date", onChange }} />
                                <CustomTableCell {...{ row, name: "Year", onChange }} />
                                <CustomTableCell {...{ row, name: "message_from_buyer", onChange }} />
                            </StyledTableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                                colSpan={10}
                                count={Math.ceil(count / rows.length)}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: { "aria-label": "rows per page" },
                                    native: true,
                                }}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Paper>
    );
}

export default AllOrdersTable;
