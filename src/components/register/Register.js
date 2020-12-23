import React, { useState } from "react";
import { useHistory } from "react-router-dom";
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
import Modal from "@material-ui/core/Modal";

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
    color: "#cc3300",
    backgroundColor: "#ffcc00",
    borderRadius: "5px",
    height: "2rem",
    fontSize: "1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default function Register() {
  const classes = useStyles();
  const history = useHistory();
  const [formErrors, setFormErrors] = useState({});
  const [values, setValues] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    policy: false,
  });

  // Modal
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMainPage = () => {
    history.push("/dashboard");
  };

  const body = (
    <div className={classes.modalpaper}>
      <form className={classes.form} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            Regisered Succesfully!
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
      </form>
    </div>
  );

  // Validation

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
    let result = validate();
    if (Object.keys(result).length === 0 && result.constructor === Object) {
      //alert(JSON.stringify(validate()));
      console.log(values);
      handleOpen();
    } else {
      console.log("Invalid");
      setFormErrors(validate());
      console.log("Errors", formErrors);
      console.log("userName", formErrors.userName);
    }
  };

  const validate = () => {
    let errors = {};

    if (!values.userName) {
      errors.userName = "Fill the Username";
    } else if (!values.email) {
      errors.email = "Fill the Email Address";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid Email Address";
    } else if (!values.password) {
      errors.password = "Enter Your Password";
    } else if (values.password.length < 8) {
      errors.password = "Password must be min 8 characters!";
    } else if (!values.confirmPassword) {
      errors.confirmPassword = "Confirm Password";
    } else if (!(values.password === values.confirmPassword)) {
      errors.confirmPassword = "Didn't Match Password";
    } else if (!values.policy) {
      errors.policy = "You should accept Privacy Policy!";
    }
    return errors;
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
          {formErrors.userName && (
            <div className={classes.error}>
              <span>{formErrors.userName}</span>
            </div>
          )}
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
          {formErrors.email && (
            <div className={classes.error}>
              <span>{formErrors.email}</span>
            </div>
          )}
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
          {formErrors.password && (
            <div className={classes.error}>
              <span>{formErrors.password}</span>
            </div>
          )}
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
          {formErrors.confirmPassword && (
            <div className={classes.error}>
              <span>{formErrors.confirmPassword}</span>
            </div>
          )}
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
          {formErrors.policy && (
            <div className={classes.error}>
              <span>{formErrors.policy}</span>
            </div>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
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
