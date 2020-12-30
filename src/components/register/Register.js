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
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Modal from "@material-ui/core/Modal";
import CreateIcon from "@material-ui/icons/Create";
// PostDAta
import { postData } from '../../helper/PostData'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
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
  succes: {
    color: "#678468",
    backgroundColor: "#EDF7ED",
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
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
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
    history.push("/");
  };

  const body = (
    <div className={classes.modalpaper}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className={classes.succes}>
            <span>Regisered Succesfully! Wait for Account Verificitain.</span>
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
        Login Page
      </Button>
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
      postData("http://144.202.67.136:8080/account/register/", values).then((data) => {
        console.log("Data", data)
      }).catch((error) => {
        handleOpen()
        console.log("Error", error)
      })
      console.log(values)
      handleOpen();
    } else {
      setFormErrors(validate());
    }
  };

  const validate = () => {
    let errors = {};

    if (!values.first_name) {
      errors.first_name = "Fill the First Name!";
    } else if (!values.last_name) {
      errors.last_name = "Fill the Last Name!";
    } else if (!values.username) {
      errors.username = "Fill the username!";
    } else if (!values.email) {
      errors.email = "Fill the Email Address!";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid Email Address!";
    } else if (!values.password) {
      errors.password = "Enter Password!";
    } else if (values.password.length < 8) {
      errors.password = "Password must be min 8 characters!";
    } else if (!values.confirm_password) {
      errors.confirm_password = "Confirm Password!";
    } else if (!(values.password === values.confirm_password)) {
      errors.confirm_password = "Passwords must be matched!";
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
          <CreateIcon />
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
            id="first_name"
            label="First Name"
            onChange={handleChange}
            defaultValue={values.first_name}
            name="first_name"
            autoComplete="first_name"
            autoFocus
          />
          {formErrors.first_name && (
            <div className={classes.error}>
              <span>{formErrors.first_name}</span>
            </div>
          )}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="last_name"
            label="Last Name"
            onChange={handleChange}
            defaultValue={values.last_name}
            name="last_name"
            autoComplete="last_name"
          />
          {formErrors.last_name && (
            <div className={classes.error}>
              <span>{formErrors.last_name}</span>
            </div>
          )}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="username"
            onChange={handleChange}
            defaultValue={values.username}
            name="username"
            autoComplete="username"
          />
          {formErrors.username && (
            <div className={classes.error}>
              <span>{formErrors.username}</span>
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
            name="confirm_password"
            label="Confirm Password"
            type="password"
            id="confirm_password"
            onChange={handleChange}
            defaultValue={values.confirm_password}
            autoComplete="current-password"
          />
          {formErrors.confirm_password && (
            <div className={classes.error}>
              <span>{formErrors.confirm_password}</span>
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
            <Grid item xs>
              <Link href="/" variant="body2">
                Already have an account? Login
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
