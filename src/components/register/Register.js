import React, { useState } from "react";
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
import CreateIcon from "@material-ui/icons/Create";
import MenuItem from "@material-ui/core/MenuItem";
import { FormattedMessage, useIntl } from "react-intl";
// Post Data
import { postAuthData } from "../../helper/PostData";
import { useFormik } from "formik";
import * as yup from "yup";
import { USER_TYPE } from "../../helper/Constants";
import { toastSuccessNotify } from "../otheritems/ToastNotify";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const validationSchema = yup.object({
  username: yup
    .string("Enter your username")
    .min(2, "Username should be of minimum 2 characters length.")
    .required("Username is required"),
  first_name: yup
    .string("Enter Your Name")
    .min(2, "First Name should be of 2 characters length.")
    .required("First Name is required"),
  last_name: yup
    .string("Enter Your First Name")
    .min(2, "Last Name should be of 2 characters length.")
    .required("Password is required"),
  email: yup.string().email("Invalid email").required("Required!"),
  role: yup.string().required("Select a Role!"),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
  password2: yup
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

export default function Register() {
  const classes = useStyles();
  const history = useHistory();
  const [loginError, setLoginError] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);
  const { formatMessage } = useIntl();

  const formik = useFormik({
    initialValues: {
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      role: "",
      password: "",
      password2: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      postAuthData(`${BASE_URL}account/register/`, values)
        .then((data) => {
          toastSuccessNotify(data.data.message);
          history.push("/");
        })
        .catch(({ response }) => {
          if (response.data.username) {
            setLoginError(response.data.username);
          } else if (response.data.password) {
            setLoginError(response.data.password[0]);
          } else {
            setLoginError("Something went wrong! Try again!");
          }
          setLoginFailed(true);
        });
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <CreateIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          <FormattedMessage id="register" defaultMessage="Register" />
        </Typography>
        <form className={classes.form} onSubmit={formik.handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="username"
            label={formatMessage({
              id: "userName",
              defaultMessage: "User Name",
            })}
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
            label={formatMessage({
              id: "firstName",
              defaultMessage: "First Name",
            })}
            name="first_name"
            autoComplete="first_name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.first_name}
            error={
              formik.touched.first_name && Boolean(formik.errors.first_name)
            }
            helperText={formik.touched.first_name && formik.errors.first_name}
          />

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="last_name"
            label={formatMessage({
              id: "lastName",
              defaultMessage: "Last Name",
            })}
            name="last_name"
            autoComplete="name"
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
            label={formatMessage({
              id: "email",
              defaultMessage: "Email",
            })}
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
            id="role"
            label={formatMessage({
              id: "role",
              defaultMessage: "Role",
            })}
            name="role"
            select
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.role}
            SelectProps={{
              renderValue: (USER_TYPE) =>
                Object.keys(USER_TYPE).map((key, index) =>
                  USER_TYPE[key].toUpperCase()?.replace("_", " ")
                ),
            }}
            error={formik.touched.role && Boolean(formik.errors.role)}
            helperText={formik.touched.role && formik.errors.role}
            className={classes.textField}
          >
            {Object.keys(USER_TYPE).map((key, index) => (
              <MenuItem key={index} value={USER_TYPE[key]}>
                <FormattedMessage
                  id={USER_TYPE[key]}
                  defaultMessage={USER_TYPE[key]
                    .toUpperCase()
                    ?.replace("_", " ")}
                />
              </MenuItem>
            ))}
          </TextField>
          {formik.values.role.includes("workshop") ? (
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              required
              id="workshop"
              label={formatMessage({
                id: "workshopName",
                defaultMessage: "Workshop Name",
              })}
              name="workshop"
              autoComplete="workshop"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.workshop || ""}
            />
          ) : null}
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="password"
            label={formatMessage({
              id: "password",
              defaultMessage: "Password",
            })}
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
            label={formatMessage({
              id: "confirmPassword",
              defaultMessage: "Confirm Password",
            })}
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
              <span>{loginError}</span>
            </div>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            <FormattedMessage id="register" defaultMessage="Register" />
          </Button>
          <Grid container>
            <Grid item xs className={classes.accountCheck}>
              <Link href="/" variant="body2">
                <FormattedMessage
                  id="alreadyHaveAccount"
                  defaultMessage="Already have an account? Login."
                />
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
