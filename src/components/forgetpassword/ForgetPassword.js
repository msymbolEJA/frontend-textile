import React from "react";
//import { useHistory } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import HelpIcon from "@material-ui/icons/Help";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const validationSchema = yup.object({
  email: yup.string().email("Invalid email").required("Required"),
});

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  accountCheck: {
    marginTop: theme.spacing(2),
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
    borderRadius: 10,
  },
  error: {
    color: "#8b0000",
    backgroundColor: "#FDECEA",
    borderRadius: "5px",
    height: "auto",
    fontSize: "1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default function ForgetPassword() {
  const classes = useStyles();
  //const history = useHistory();
  /*     const [loginError, setLoginError] = useState("")
        const [loginFailed, setLoginFailed] = useState(false) */

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      axios
        .post(`${BASE_URL}account/password_reset`, values)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <HelpIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <form className={classes.form} onSubmit={formik.handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          {/*  {loginFailed && (
                        <div className={classes.error}>
                            <span>{loginError}</span>
                        </div>
                    )} */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Submit
          </Button>
          <Grid container>
            <Grid item xs className={classes.accountCheck}>
              <Link href="/" variant="body2">
                Go to Login Page
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
