import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import DATA from '../../helper/Data'
import TableContainer from "@material-ui/core/TableContainer";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        marginTop: theme.spacing(3),
        overflowX: "auto"
    },
    container: {
        maxHeight: "83vh",
    },
    table: {
        minWidth: 650
    },
    selectTableCell: {
        width: 60
    },
    tableCell: {
        width: 130,
        height: 40
    },
    input: {
        width: 130,
        height: 40
    }
}));

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const CustomTableCell = ({ row, name, onChange }) => {
    const classes = useStyles();
    const { isEditMode } = row;
    return (
        <TableCell align="center" className={classes.tableCell}>
            {isEditMode ? (
                <Input
                    value={row[name]}
                    name={name}
                    onChange={e => onChange(e, row)}
                    className={classes.input}
                />
            ) : (
                    row[name]
                )}
        </TableCell>
    );
};

function App() {
    const [rows, setRows] = React.useState(DATA);
    const [previous, setPrevious] = React.useState({});
    const classes = useStyles();

    const onChange = (e, row) => {
        if (!previous[row.id]) {
            setPrevious(state => ({ ...state, [row.id]: row }));
        }
        const value = e.target.value;
        const name = e.target.name;
        const { id } = row;
        const newRows = rows.map(row => {
            if (row.id === id) {
                return { ...row, [name]: value };
            }
            return row;
        });
        setRows(newRows);
    };

    const handleRowClick = (id) => {
        setRows(state => {
            return rows.map(row => {
                if (row.id === id) {
                    return { ...row, isEditMode: true };
                }
                return row;
            });
        });
    }

    const handleRowChange = (id) => {
        setRows(state => {
            return rows.map(row => {
                if (row.id === id) {
                    console.log(row)
                    return { ...row, isEditMode: false };
                }
                return row;
            });
        });
    }

    const handleRowKeyDown = (e, id) => {
        if (e.key === 'Enter') {
            handleRowChange(id)
        }
    }

    const handleRowBlur = (id) => {
        handleRowChange(id)
    }

    return (
        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <Table className={classes.table} stickyHeader aria-label="caption table">
                    <caption>A barbone structure table example with a caption</caption>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">Name&nbsp;</StyledTableCell>
                            <StyledTableCell align="center">MPG</StyledTableCell>
                            <StyledTableCell align="center">Cylinders</StyledTableCell>
                            <StyledTableCell align="center">Displacement</StyledTableCell>
                            <StyledTableCell align="center">Horsepower</StyledTableCell>
                            <StyledTableCell align="center">Weight(lb)</StyledTableCell>
                            <StyledTableCell align="center">Acceleration</StyledTableCell>
                            <StyledTableCell align="center">Year</StyledTableCell>
                            <StyledTableCell align="center">Origin</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(row => (
                            <TableRow key={row.id} id={row.id}
                                onClick={(e) => handleRowClick(row.id)}
                                onBlur={(e) => handleRowBlur(row.id)}
                                onKeyDown={(e) => handleRowKeyDown(e, row.id)}
                            >
                                <CustomTableCell {...{ row, name: "Name", onChange }} />
                                <CustomTableCell {...{ row, name: "Miles_per_Gallon", onChange }} />
                                <CustomTableCell {...{ row, name: "Cylinders", onChange }} />
                                <CustomTableCell {...{ row, name: "Displacement", onChange }} />
                                <CustomTableCell {...{ row, name: "Horsepower", onChange }} />
                                <CustomTableCell {...{ row, name: "Weight_in_lbs", onChange }} />
                                <CustomTableCell {...{ row, name: "Acceleration", onChange }} />
                                <CustomTableCell {...{ row, name: "Year", onChange }} />
                                <CustomTableCell {...{ row, name: "Origin", onChange }} />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

export default App
