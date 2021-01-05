import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import CreateIcon from "@material-ui/icons/Create";
// Post Data
import { postData } from "../../helper/PostData";
import Modal from "@material-ui/core/Modal";
import { useFormik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object({
    username: yup.string("Enter your username")
        .min(2, "Username should be of minimum 2 characters length.")
        .required("Username is required"),
    first_name: yup.string("Enter Your Name")
        .min(2, "First Name should be of 2 characters length.")
        .required("First Name is required"),
    last_name: yup.string("Enter Your First Name")
        .min(2, "Last Name should be of 2 characters length.")
        .required("Password is required"),
    email: yup.string().email('Invalid email').required('Required'),
    password: yup
        .string("Enter your password")
        .min(5, "Password should be of minimum 5 characters length")
        .required("Password is required"),
    password2: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required("Confirm Password")
});

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright © "}
            <Link color="inherit" href="https://example.com/">
                Our Website
      </Link>
            {new Date().getFullYear()}.
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100vh"
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    accountCheck: {
        marginTop: theme.spacing(2)
    },
    modalpaper: {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        position: "absolute",
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: "2px solid #000",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        borderRadius: 10
    },
    error: {
        color: "#8b0000",
        backgroundColor: "#FDECEA",
        borderRadius: "5px",
        height: "2rem",
        fontSize: "1rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
}));

export default function Register() {
    const classes = useStyles();
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const [loginFailed, setLoginFailed] = useState(false)

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleMainPage = () => {
        handleClose();
        history.push("/")
    };

    const body = (
        <div className={classes.modalpaper}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <div className={classes.error}>
                        <span>Registered succesfully! Wait for admin verification.</span>
                    </div>
                </Grid>
            </Grid>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleMainPage}
            >
                Ok
      </Button>
        </div>
    );

    const formik = useFormik({
        initialValues: {
            username: "",
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            password2: "",
            registerPrivacy: false
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            postData("http://144.202.67.136:8080/account/register/", values).then((data) => {
                console.log("DATA : ", data)
                handleOpen()
                history.push("/");
            }).catch((error) => {
                console.log("Error", error)
                setLoginFailed(true)
            })
        }
    });

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <CreateIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Register
                    </Typography>
                <form className={classes.form} onSubmit={formik.handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="username"
                        label="User Name"
                        name="username"
                        autoComplete="username"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        autoFocus
                        value={formik.values.username}
                        error={formik.touched.username && Boolean(formik.errors.username)}
                        helperText={formik.touched.username && formik.errors.username}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="first_name"
                        label="First Name"
                        name="first_name"
                        autoComplete="first_name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.first_name}
                        error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                        helperText={formik.touched.first_name && formik.errors.first_name}
                    />

                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="last_name"
                        label="Last Name"
                        name="last_name"
                        autoComplete="last_name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.last_name}
                        error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                        helperText={formik.touched.last_name && formik.errors.last_name}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="password2"
                        label="Confirm Password"
                        type="password"
                        id="password2"
                        value={formik.values.password2}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password2 && Boolean(formik.errors.password2)}
                        helperText={formik.touched.password2 && formik.errors.password2}
                    />
                    {loginFailed && (
                        <div className={classes.error}>
                            <span>Username or email already exist!</span>
                        </div>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Register
                    </Button>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                    >
                        {body}
                    </Modal>
                    <Grid container>
                    </Grid>
                    <Grid container>
                        <Grid item xs className={classes.accountCheck}>
                            <Link href="/" variant="body2">
                                Already have an account? Login
                </Link>
                        </Grid>
                    </Grid>
                </form>
                <Box mt={5}>
                    <Copyright />
                </Box>
            </div>
        </Container>
    );
}
