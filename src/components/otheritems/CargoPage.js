import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";

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


const CargoPage = () => {
    const classes = useStyles();

    return (
        <div>
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
        </div>
    )
}

export default CargoPage
