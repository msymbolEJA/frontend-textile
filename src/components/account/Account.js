import React, { useContext, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Modal from "@material-ui/core/Modal";
import { AppContext } from "../../context/Context";
import { getData } from "../../helper/PostData";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    padding: 80,
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  icon: {
    fontSize: 80,
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
  modalButton: {
    margin: theme.spacing(3, 0, 2),
  },
  info: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Account() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const { user, setUser } = useContext(AppContext);
  const [accountData, setAccountData] = useState();
  const [img, setImg] = useState();

  //console.log(user);

  const updateUser = (e) => {
    e.preventDefault();
    setUser({ ...user, username: "test4" });
    setOpen(false);
    //console.log(accountData);
  };

  const changeHandler = (e) => {
    setAccountData({ ...accountData, [e.target.name]: e.target.value });
  };

  const handleOpen = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    getData(
      `http://144.202.67.136:8080/account/profile/${localStorage.getItem(
        "localId"
      )}/`
    )
      .then((response) => {
        console.log(response.data);
        setAccountData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const body = (
    <div className={classes.modalpaper}>
      <form className={classes.form} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoComplete="username"
              name="username"
              variant="outlined"
              required
              fullWidth
              id="username"
              label="Username"
              autoFocus
              defaultValue={accountData?.username}
              onChange={(e) => changeHandler(e)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              defaultValue={accountData?.email}
              onChange={(e) => changeHandler(e)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="password"
              label="Current Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => changeHandler(e)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type="password"
              id="newPassword"
              autoComplete="current-password"
              onChange={(e) => changeHandler(e)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="current-password"
              onChange={(e) => changeHandler(e)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" fullWidth component="label">
              Update Profile Picture
              <input type="file" hidden />
            </Button>
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={(e) => updateUser(e)}
        >
          Update
        </Button>
      </form>
    </div>
  );

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <img src={img} alt="user" />
        </Avatar>
        <div className={classes.info}>
          <Typography component="h1" variant="h5">
            {accountData?.username}
          </Typography>
          <Typography variant="h6">{accountData?.email}</Typography>
        </div>
        <div>
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            onClick={(e) => handleOpen(e)}
            className={classes.modalButton}
          >
            Update Profile
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            {body}
          </Modal>
        </div>
      </div>
    </Container>
  );
}
