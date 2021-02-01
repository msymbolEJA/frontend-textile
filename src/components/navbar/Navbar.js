import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import FormGroup from "@material-ui/core/FormGroup";
import MenuItem from "@material-ui/core/MenuItem";
import StoreIcon from "@material-ui/icons/Store";
import Menu from "@material-ui/core/Menu";
import { AppContext } from "../../context/Context";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  rightTitle: {
    marginLeft: "1rem",
  },
  title: {
    flexGrow: 1,
  },
  hrefStyle: {
    textDecoration: "none",
    color: "#474747",
    fontWeight: "545",
  },
  rightTop: {
    display: "flex",
    flexDirection: "row",
  },
  userRole: {
    fontSize: "0.8rem",
    color: "#d3d3d3",
  },
  userName: {
    fontSize: "1.2rem",
  },
}));

export default function MenuAppBar() {
  const classes = useStyles(); // eslint-disable-next-line
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { user } = useContext(AppContext);
  //console.log("user", user);
  const open = Boolean(anchorEl);
  const history = useHistory();

  //console.log(user.role);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAccountPage = () => {
    history.push("/account");
    setAnchorEl(null);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMainPage = () => {
    history.push("/dashboard");
    setAnchorEl(null);
  };
  const handleLogout = () => {
    history.push("/");
    setAnchorEl(null);
    localStorage.removeItem("x-auth-token");
  };

  const localRole = localStorage.getItem("localRole");
  const localUser = localStorage.getItem("localUser");

  return (
    <div className={classes.root}>
      <FormGroup></FormGroup>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={handleMainPage}
          >
            <StoreIcon />
            <Typography variant="h6" className={classes.rightTitle}>
              Shiny Store
            </Typography>
          </IconButton>
          <div className={classes.title}></div>
          {auth && (
            <div className={classes.rightTop}>
              <div className={classes.userInfo}>
                <div className={classes.userRole}>
                  {user?.role?.toUpperCase() || localRole?.toUpperCase()}
                </div>
                <div className={classes.userName}>
                  {localUser || user.user || user.username}
                </div>
              </div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                style={{ marginTop: "3.2rem" }}
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
              >
                {localRole === "admin" && (
                  <MenuItem>
                    <a
                      className={classes.hrefStyle}
                      href="http://144.202.67.136:8080/admin/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Admin Panel
                    </a>
                  </MenuItem>
                )}
                <MenuItem onClick={handleAccountPage}>Account</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
