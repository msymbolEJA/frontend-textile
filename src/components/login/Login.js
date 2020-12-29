import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import LocalMallIcon from "@material-ui/icons/LocalMall";
// Post Data
import { postData } from "../../helper/PostData"
import Modal from "@material-ui/core/Modal";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://example.com/">
        Our Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage:
      "url(https://images.unsplash.com/photo-1548142723-aae7678afa53?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=635&q=80)",
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

export default function SignInSide() {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMainPage = () => {
    handleClose()
  };

  const body = (
    <div className={classes.modalpaper}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className={classes.error}>
            <span>Invalid Credentials!</span>
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


  const handleSubmit = (e) => {
    e.preventDefault();
    validate();
    if (validate()) {
      postData("http://144.202.67.136:8080/account/login/", values).then((data) => {
        console.log("Data", data)
        const response = data?.user?.is_active
        console.log(response)
        if (response) {
          localStorage.setItem("token", data?.token)
          console.log("Token", localStorage.getItem("token"))
          history.push("/dashboard");
        } else {
          console.log("Your account is not verified!")
          handleOpen()
        }
      }).catch((error) => {
        handleOpen()
        console.log("Error", error)
      })
      console.log(values)

    } else {
      alert("Fill Pasword and Email!");
    }
  };

  const validate = (e) => {
    const errors = {};
    if (!values.username) {
      errors.username = "Fill the User Name";
      return false;
    } else if (!values.password) {
      errors.password = "Enter Your Password";
      return false;
    }
    return true;
  };


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
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="text"
              label="User Name"
              name="username"
              autoComplete="username"
              onChange={(e) => setValues({ ...values, username: e.target.value })}
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
              autoComplete="current-password"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Log In
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
                <Link href="#" variant="body2">
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
          <Box mt={5}>
            <Copyright />
          </Box>
        </div>
      </Grid>
    </Grid>
  );
}
