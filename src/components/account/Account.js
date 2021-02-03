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
import PublishIcon from "@material-ui/icons/Publish";
import { putImage } from "../../helper/PostData";

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
    cursor: "pointer",
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
  updatePictureIcon: {
    position: "absolute",
    zIndex: 4,
    color: "white",
    fontSize: "3rem",
  },
  hrStyle: { backgroundColor: "#3F51B5", height: "2px", border: 0 },
  header: { color: "#f44336" },
}));

export default function Account() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const { user, setUser } = useContext(AppContext);
  const [accountData, setAccountData] = useState();
  const [updateIcon, setUpdateIcon] = useState(false);

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

  const fileSelectedHandler = (e) => {
    //setSelectedFile(e.target.files[0]);
    let imgFile = e.target.files[0];
    console.log(imgFile);
    const localId = Number(localStorage.getItem("localId"));
    console.log("....", localId);
    try {
      let path = `http://144.202.67.136:8080/account/profile/${localId}/`;
      console.log(path);
      putImage(path, imgFile, imgFile.name)
        .then((res) => {
          console.log(res);
        })
        .catch(({ response }) => {
          console.log(response);
        })
        .finally(() => {
          // getData();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateIconFlag = () => {
    console.log("updateIconFlag");
    setUpdateIcon(!updateIcon);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <label htmlFor="myInput">
          <Avatar
            className={classes.avatar}
            onMouseOver={updateIconFlag}
            onMouseOut={updateIconFlag}
          >
            <img
              src={
                accountData?.image ||
                "https://cdn.dribbble.com/users/304574/screenshots/6222816/male-user-placeholder.png"
              }
              alt="user"
            />
            {updateIcon && (
              <PublishIcon className={classes.updatePictureIcon} />
            )}
            <input
              type="file"
              hidden
              onChange={(e) => fileSelectedHandler(e)}
              id="myInput"
              style={{ display: "none" }}
            />
          </Avatar>
        </label>
        <div className={classes.info}>
          <Typography variant="h6" className={classes.header}>
            Username
          </Typography>
          <Typography component="h1" variant="h5">
            {accountData?.username}
          </Typography>
          <hr className={classes.hrStyle} />
          <Typography variant="h6" className={classes.header}>
            Email
          </Typography>
          <Typography variant="h6">{accountData?.email}</Typography>
          <hr className={classes.hrStyle} />

          {accountData?.first_name ? (
            <>
              <Typography variant="h6" className={classes.header}>
                First Name
              </Typography>
              <Typography variant="h6">{accountData?.first_name}</Typography>
              <hr className={classes.hrStyle} />
            </>
          ) : null}
          {accountData?.last_name ? (
            <>
              <Typography variant="h6" className={classes.header}>
                Last Name
              </Typography>
              <Typography variant="h6">{accountData?.last_name}</Typography>
              <hr className={classes.hrStyle} />
            </>
          ) : null}
          <Typography variant="h6" className={classes.header}>
            User Role
          </Typography>
          <Typography variant="h6">{accountData?.role}</Typography>
          <hr className={classes.hrStyle} />

          {accountData?.workshop ? (
            <>
              <Typography variant="h6" className={classes.header}>
                Workshop
              </Typography>
              <Typography variant="h6">{accountData?.workshop}</Typography>
              <hr className={classes.hrStyle} />
            </>
          ) : null}
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
