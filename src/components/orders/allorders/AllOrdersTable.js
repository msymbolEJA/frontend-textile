import React, { useState, useEffect } from "react";
import axios from 'axios'
import CustomButtonGroup from "./CustomButtonGroup"
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
import { tagsData } from "../../../helper/Constants"


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
    const [selectedTag, setSelectedTag] = useState("All Orders");
    const [url, setUrl] = useState(`http://144.202.67.136:8080/etsy/orders/?limit=${rowsPerPage}&offset=${page * rowsPerPage}`)


    //--------------- Get Orders
    useEffect(() => {
        axios.get(url)
            .then(res => {
                setRows(res.data.results)
                setCount(res.data.count)
            }).catch(error => {
                console.log(error);
            })
    }, [page, rowsPerPage, url])
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

    const handleTagChange = (e) => {
        const statu = e.currentTarget.id
        setSelectedTag(statu);
        //console.log(e.target.innerHTML);
        console.log(statu);
        if (statu === 'all orders') {
            setUrl(`http://144.202.67.136:8080/etsy/orders/?limit=${rowsPerPage}&offset=${page * rowsPerPage}`)
        } else {
            setUrl(`http://144.202.67.136:8080/etsy/orders/?status=${statu}&limit=${rowsPerPage}&offset=${page * rowsPerPage}`)
        }
        setPage(0);
    };

    return (
        <Paper className={classes.root}>
            <CustomButtonGroup selectedTag={selectedTag} handleTagChange={handleTagChange} tagsData={tagsData} />
            <TableContainer className={classes.container}>
                <Table
                    className={classes.table}
                    stickyHeader
                    aria-label="sticky table"
                    size="small"
                >
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">Receipt Id</StyledTableCell>
                            <StyledTableCell align="center">created_date</StyledTableCell>
                            <StyledTableCell align="center">created_tsz</StyledTableCell>
                            <StyledTableCell align="center">Buyer</StyledTableCell>
                            <StyledTableCell align="center">SKU</StyledTableCell>
                            <StyledTableCell align="center">seller_user_id</StyledTableCell>
                            <StyledTableCell align="center">Color</StyledTableCell>
                            <StyledTableCell align="center">Explanation</StyledTableCell>
                            <StyledTableCell align="center">Ready</StyledTableCell>
                            <StyledTableCell align="center">item_index</StyledTableCell>
                            <StyledTableCell align="center">last_updated</StyledTableCell>
                            <StyledTableCell align="center">length</StyledTableCell>
                            <StyledTableCell align="center">Note</StyledTableCell>
                            <StyledTableCell align="center">personalization</StyledTableCell>
                            <StyledTableCell align="center">Quantity</StyledTableCell>
                            <StyledTableCell align="center">Ready Data</StyledTableCell>
                            <StyledTableCell align="center">Size</StyledTableCell>
                            <StyledTableCell align="center">Last Updated</StyledTableCell>
                            <StyledTableCell align="center">Space</StyledTableCell>
                            <StyledTableCell align="center">Start</StyledTableCell>
                            <StyledTableCell align="center">Status</StyledTableCell>
                            <StyledTableCell align="center">Transaction Id</StyledTableCell>
                            <StyledTableCell align="center">Type</StyledTableCell>
                            <StyledTableCell align="center">Message From Buyer</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows?.map((row) => (
                            <StyledTableRow key={row.id}>
                                <CustomTableCell {...{ row, name: "receipt_id", onChange }} />
                                <CustomTableCell {...{ row, name: "created_date", onChange }} />
                                <CustomTableCell {...{ row, name: "creation_tsz", onChange }} />
                                <CustomTableCell {...{ row, name: "buyer", onChange }} />
                                <CustomTableCell {...{ row, name: "sku", onChange }} />
                                <CustomTableCell {...{ row, name: "seller_user_id", onChange }} />
                                <CustomTableCell {...{ row, name: "color", onChange }} />
                                <CustomTableCell {...{ row, name: "explanation", onChange }} />
                                <CustomTableCell {...{ row, name: "is_ready", onChange }} />
                                <CustomTableCell {...{ row, name: "item_index", onChange }} />
                                <CustomTableCell {...{ row, name: "last_updated", onChange }} />
                                <CustomTableCell {...{ row, name: "length", onChange }} />
                                <CustomTableCell {...{ row, name: "note", onChange }} />
                                <CustomTableCell {...{ row, name: "personalization", onChange }} />
                                <CustomTableCell {...{ row, name: "qty", onChange }} />
                                <CustomTableCell {...{ row, name: "ready_date", onChange }} />
                                <CustomTableCell {...{ row, name: "size", onChange }} />
                                <CustomTableCell {...{ row, name: "last_updated", onChange }} />
                                <CustomTableCell {...{ row, name: "space", onChange }} />
                                <CustomTableCell {...{ row, name: "start", onChange }} />
                                <CustomTableCell {...{ row, name: "status", onChange }} />
                                <CustomTableCell {...{ row, name: "transaction_id", onChange }} />
                                <CustomTableCell {...{ row, name: "type", onChange }} />
                                <CustomTableCell {...{ row, name: "message_from_buyer", onChange }} />
                            </StyledTableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <td>Total Record :</td>
                            <td>{count}</td>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 100]}
                                colSpan={22}
                                count={count}
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
