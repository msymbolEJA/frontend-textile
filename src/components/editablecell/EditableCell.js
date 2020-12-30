import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        marginTop: theme.spacing(3),
        overflowX: "auto"
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

const createData = (name, calories, fat, carbs, protein) => ({
    id: name.replace(" ", "_"),
    name,
    calories,
    fat,
    carbs,
    protein,
    isEditMode: false
});

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
    const [rows, setRows] = React.useState([
        createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
        createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
        createData("Eclair", 262, 16.0, 24, 6.0)
    ]);
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

    const handleRowClick = (e) => {
        const id = e.currentTarget.id
        setRows(state => {
            return rows.map(row => {
                if (row.id === id) {
                    return { ...row, isEditMode: true };
                }
                return row;
            });
        });
        //onToggleEditMode(e.currentTarget.id)
    }

    const handleRowKeyDown = (e) => {
        if (e.key === 'Enter') {
            const id = e.currentTarget.id
            setRows(state => {
                return rows.map(row => {
                    if (row.id === id) {
                        return { ...row, isEditMode: false };
                    }
                    return row;
                });
            });
        }
    }

    const handleRowBlur = (e) => {
        const id = e.currentTarget.id
        setRows(state => {
            return rows.map(row => {
                if (row.id === id) {
                    return { ...row, isEditMode: false };
                }
                return row;
            });
        });
    }

    return (
        <Paper className={classes.root}>
            <Table className={classes.table} aria-label="caption table">
                <caption>A barbone structure table example with a caption</caption>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Dessert (100g serving)</TableCell>
                        <TableCell align="center">Calories</TableCell>
                        <TableCell align="center">Fat&nbsp;(g)</TableCell>
                        <TableCell align="center">Carbs&nbsp;(g)</TableCell>
                        <TableCell align="center">Protein&nbsp;(g)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => (
                        <TableRow key={row.id} id={row.id}
                            onClick={(e) => handleRowClick(e)}
                            onBlur={(e) => handleRowBlur(e)}
                            onKeyDown={(e) => handleRowKeyDown(e)}
                        >
                            <CustomTableCell {...{ row, name: "name", onChange }} />
                            <CustomTableCell {...{ row, name: "calories", onChange }} />
                            <CustomTableCell {...{ row, name: "fat", onChange }} />
                            <CustomTableCell {...{ row, name: "carbs", onChange }} />
                            <CustomTableCell {...{ row, name: "protein", onChange }} />
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}

export default App
