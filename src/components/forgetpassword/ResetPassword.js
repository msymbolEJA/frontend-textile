import React from "react";
import { useHistory } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
// Post Data
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const validationSchema = yup.object({
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password"),
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

export default function Register(props) {
  const classes = useStyles();
  const history = useHistory();

  const token = props.match.params.id;

  const formik = useFormik({
    initialValues: {
      token: token,
      password: "",
      passwordConfirm: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      axios
        .post(`${BASE_URL}account/change_password`, values)
        .then((res) => {
          history.push("/");
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
          <RotateLeftIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <form className={classes.form} onSubmit={formik.handleSubmit}>
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
            name="passwordConfirm"
            label="Confirm Password"
            type="password"
            id="passwordConfirm"
            value={formik.values.passwordConfirm}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.passwordConfirm &&
              Boolean(formik.errors.passwordConfirm)
            }
            helperText={
              formik.touched.passwordConfirm && formik.errors.passwordConfirm
            }
          />
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
