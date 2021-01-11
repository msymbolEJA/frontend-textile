import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import FindInPageIcon from '@material-ui/icons/FindInPage';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccordionDetails from '@material-ui/core/AccordionDetails';

const useStyles = makeStyles((theme) => ({
    paper: {
        margin: theme.spacing(4, 4),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    avatar: {
        marginRight: theme.spacing(2),
        backgroundColor: theme.palette.primary.main
    },
    form: {
        width: "100%",
    },
    btnGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: theme.spacing(2, 0, 2),
    },
    searchBtn: {
        width: '74%',
    },
    clearBtn: {
        width: '24%',
    },
    search: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
}));

export default function Register() {
    const classes = useStyles();


    return (
        <div>        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Avatar className={classes.avatar}>
                            <FindInPageIcon />
                        </Avatar>
                        <Typography className={classes.search} component="h1" variant="h5">
                            Search
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <form className={classes.form}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id="username"
                                label="Id"
                                type="text"
                                name="id"
                                autoComplete="id"
                                autoFocus
                            />
                            {/* TODO : Option */}
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id="status"
                                label="Status"
                                type="text"
                                name="status"
                                autoComplete="status"
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id="buyer"
                                label="Buyer"
                                type="text"
                                name="buyer"
                                autoComplete="buyer"
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id="sku"
                                label="SKU"
                                type="text"
                                name="sku"
                                autoComplete="sku"
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                name="supplier"
                                label="Supplier"
                                type="text"
                                id="supplier"
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                name="internal_note"
                                label="Internal Note"
                                type="text"
                                id="internal_note"
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                name="receipt_id"
                                label="Receipt Id"
                                type="nmuber"
                                id="receipt_id"
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                name="tracking_code"
                                label="Tracking Code"
                                type="text"
                                id="tracking_code"
                            />
                            <div className={classes.btnGroup}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    className={classes.searchBtn}
                                >
                                    Search
                            </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="default"
                                    className={classes.clearBtn}
                                >
                                    Clear
                            </Button>
                            </div>
                        </form>
                    </AccordionDetails>
                </Accordion>
            </div>
        </Container>
        </div>
    );
}
