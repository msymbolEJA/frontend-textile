import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Register() {
  const classes = useStyles();
  const [values, setValues] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    policy: false,
  });

  const handleChange = (e) => {
    // console.log(info);
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handlePolicyChange = (e) => {
    setValues({ ...values, policy: e.target.checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // validate();
    if (!validate()) {
      //alert(JSON.stringify(validate()));
      console.log(values);
    }
  };

  const validate = () => {
    const errors = {};

    if (!values.userName) {
      return (errors.userName = "Fill the Username");
    }
    if (!values.email) {
      return (errors.email = "Fill the Email Address");
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      return (errors.email = "Invalid Email Address");
    }
    if (!values.password) {
      return (errors.password = "Enter Your Password");
    } else if (values.password.length < 8) {
      return (errors.password = "Password must be min 8 characters!");
    } else if (!values.confirmPassword) {
      return (errors.password = "Confirm Password");
    } else if (!(values.password === values.confirmPassword)) {
      return (errors.password = "Didn't Match Password");
    }
    if (!values.policy) {
      return (errors.policy = "You should accept Privacy Policy!");
    }
    return false;
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="userName"
            label="Username"
            onChange={handleChange}
            defaultValue={values.userName}
            name="userName"
            autoComplete="userName"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            onChange={handleChange}
            defaultValue={values.email}
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={handleChange}
            defaultValue={values.password}
            autoComplete="current-password"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            onChange={handleChange}
            defaultValue={values.confirmPassword}
            autoComplete="current-password"
          />
          <FormControlLabel
            control={
              <Checkbox
                value="remember"
                defaultValue={values.policy}
                color="primary"
                onChange={handlePolicyChange}
              />
            }
            label="I accept Privacy Policy"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/" variant="body2">
                Do have an account? Login
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
