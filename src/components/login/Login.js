import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import LocalMallIcon from "@material-ui/icons/LocalMall";
// Post Data
import { postAuthData } from "../../helper/PostData";
import { useFormik } from "formik";
import * as yup from "yup";
import { AppContext } from "../../context/Context";

const validationSchema = yup.object({
  username: yup
    .string("Enter your username")
    .min(2, "Username should be of minimum 2 characters length.")
    .required("Username is required"),
  password: yup
    .string("Enter your password")
    .min(5, "Password should be of minimum 5 characters length")
    .required("Password is required"),
});

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(https://picsum.photos/800/600)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
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
    height: "2rem",
    fontSize: "1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default function Login() {
  const classes = useStyles();
  const history = useHistory();
  const { setUser, setAuth } = useContext(AppContext);
  const [loginFailed, setLoginFailed] = useState(false);
  const [errorText, setErrorText] = useState("");

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      postAuthData("http://144.202.67.136:8080/account/login/", values)
        .then((response) => {
          //console.log(values.username)
          //console.log(response.data);
          setUser(response?.data);
          const token = response?.data?.access;
          if (token) {
            localStorage.setItem("x-auth-token", token);
            localStorage.setItem("localUser", response?.data?.user);
            localStorage.setItem("localEmail", response?.data?.email);
            localStorage.setItem("localRole", response?.data?.role);
            localStorage.setItem("localId", response?.data?.id);
            //console.log("Token", localStorage.getItem("x-auth-token"))
            console.log("Logged in succesfully!");
            setAuth(true);
            history.push("/dashboard");
          }
        })
        .catch(({ response }) => {
          if (response) {
            setLoginFailed(true);
            //console.log("Error", response)
            //console.log(response?.data?.non_field_errors[0]);
            try {
              setErrorText(response?.data?.non_field_errors[0]);
            } catch (error) {
              setErrorText("Server Error!");
            }
          } else {
            setLoginFailed(true);
            setErrorText("Something went wrong!");
          }
        });
    },
  });

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LocalMallIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log In
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
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            {loginFailed && (
              <div className={classes.error}>
                <span>{errorText}</span>
              </div>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Log In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/forgot" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs className={classes.accountCheck}>
                <Link href="/register" variant="body2">
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
