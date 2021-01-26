import React, { useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import CustomTableCell from "../CustomTableCell";
import Typography from '@material-ui/core/Typography';
import DATA from "../../../../helper/Data";
import { Button } from "@material-ui/core";
import { getOnePdf, getData } from "../../../../helper/PostData";

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
    rootBottom: {
        backgroundColor: 'lightgrey',
        minHeight: '10vh',
        margin: "5vw"
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
    header: {
        fontSize: "1.5rem"
    },
    sub: {
        fontSize: '1rem'
    }
}));

const OrderDetails = ({ match }) => {
    const [rows, setRows] = useState(DATA);
    const [previous, setPrevious] = useState({});
    const classes = useStyles();



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

    const getPdf = () => {
        let data= rows.id
        getOnePdf("http://144.202.67.136:8080/etsy/print_one/", data).then((res)=>{
            console.log(res.data.url)
            console.log(rows[0].id)
        }).catch((error)=>{
            console.log(error)
        })
    }

    useEffect(() => {
        let data = ""
        let url = `http://144.202.67.136:8080/etsy/mapping/${match.params.id}/`
        //console.log(url)
        getData(url, data).then((res)=>{
            //console.log(res.data)
            setRows([res.data])
        }).catch((err)=>{
            console.log(err)
        })
    },[match.params.id])

    return (
        <div>
            <Paper className={classes.root}>
                <Typography className={classes.header}>Order Details</Typography>
                <TableContainer className={classes.container}>
                    <Table
                        className={classes.table}
                        stickyHeader
                        aria-label="sticky table"
                        size="small"
                    >
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">Order No</StyledTableCell>
                                <StyledTableCell align="center">Date</StyledTableCell>
                                <StyledTableCell align="center">System Date</StyledTableCell>
                                <StyledTableCell align="center">Buyer</StyledTableCell>
                                <StyledTableCell align="center">Supplier</StyledTableCell>
                                <StyledTableCell align="center">Type</StyledTableCell>
                                <StyledTableCell align="center">length</StyledTableCell>
                                <StyledTableCell align="center">Color</StyledTableCell>
                                <StyledTableCell align="center">Qty</StyledTableCell>
                                <StyledTableCell align="center">size</StyledTableCell>
                                <StyledTableCell align="center">start</StyledTableCell>
                                <StyledTableCell align="center">explanation</StyledTableCell>
                                <StyledTableCell align="center">note</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows ? rows?.map((row) => (
                                <StyledTableRow key={row.id} id={row.id} >
                                    <CustomTableCell {...{ row, name: "receipt_id", onChange }} />
                                    <CustomTableCell {...{ row, name: "created_date", onChange }} />
                                    <CustomTableCell {...{ row, name: "creation_tsz", onChange }} />
                                    <CustomTableCell {...{ row, name: "buyer", onChange }} />
                                    <CustomTableCell {...{ row, name: "supplier", onChange }} />
                                    <CustomTableCell {...{ row, name: "type", onChange }} />
                                    <CustomTableCell {...{ row, name: "length", onChange }} />
                                    <CustomTableCell {...{ row, name: "color", onChange }} />
                                    <CustomTableCell {...{ row, name: "qty", onChange }} />
                                    <CustomTableCell {...{ row, name: "size", onChange }} />
                                    <CustomTableCell {...{ row, name: "start", onChange }} />
                                    <CustomTableCell {...{ row, name: "explanation", onChange }} />
                                    <CustomTableCell {...{ row, name: "note", onChange }} />
                                </StyledTableRow>
                            )) : <tr><td colSpan="13" style={{fontSize:"2rem"}}>"Nothing Found!"</td></tr>}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Paper className={classes.rootBottom}>
                <h1>Create Post</h1><hr />
                <h4>Reference Number</h4>
            </Paper>
            <Paper className={classes.rootBottom}>
                <h1>Cargo Company</h1>
            </Paper>
            <Paper className={classes.rootBottom}>
                <h1>Following Code</h1>
            </Paper>
            <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submit}
            >
                Are you sure for package?
            </Button>
            <br/>
            <br/>
            <Button 
            onClick={getPdf} 
            variant="contained"
            color="primary"
            className={classes.submit}>GETPDF</Button>
        </div>
    );
}

export default OrderDetails
