import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AllOrders from "./AllOrders";
import { AppContext } from "../../context/Context";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
// Icons
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ViewListIcon from "@material-ui/icons/ViewList";
import FindInPageIcon from "@material-ui/icons/FindInPage";
import AddCircleIcon from "@material-ui/icons/AddCircle";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 30,
  },
  boxes: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.primary,
  },
  icon: {
    fontSize: 50,
  },
  button: {
    margin: "0.3rem",
    width: "10rem",
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const { user } = useContext(AppContext);
  const history = useHistory();

  const localUser = localStorage.getItem("localUser");

  const userRole = user.role || localUser;

  // console.log(userRole);

  const handleClick = (e) => {
    history.push(`/${e.currentTarget.id}`);
  };

  return (
    <div className={classes.root}>
      <div className={classes.boxes}>
        {userRole === "admin" ||
        userRole === "shop_manager" ||
        userRole === "shop_packer" ? (
          <div style={{ flexDirection: "row" }}>
            <Button
              color="primary"
              variant="outlined"
              id="all-orders"
              className={classes.button}
              startIcon={<ViewListIcon />}
              onClick={(e) => handleClick(e)}
            >
              All Orders
            </Button>
            <Button
              color="primary"
              variant="outlined"
              id="approval"
              className={classes.button}
              startIcon={<ThumbUpIcon />}
              onClick={(e) => handleClick(e)}
            >
              Approval
            </Button>
            <Button
              color="primary"
              variant="outlined"
              id="search"
              className={classes.button}
              startIcon={<FindInPageIcon />}
              onClick={(e) => handleClick(e)}
            >
              Search
            </Button>
            <Button
              color="primary"
              variant="outlined"
              id="new-order"
              className={classes.button}
              startIcon={<AddCircleIcon />}
              onClick={(e) => handleClick(e)}
            >
              New
            </Button>
          </div>
        ) : null}
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ height: "78vh" }}
        >
          <AllOrders userRole={userRole} />
        </Grid>
      </div>
    </div>
  );
};

export default Dashboard;
