import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AwaitingOrders from "./AwaitingOrders";
import AllOrders from "./AllOrders";
import SearchOrders from "./SearchOrders";
import NewOrders from "./NewOrders";
import { AppContext } from "../../context/Context";
// Icons
import DashboardRoundedIcon from "@material-ui/icons/DashboardRounded";

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
}));

const Dashboard = () => {
  const classes = useStyles();
  const { user } = useContext(AppContext);

  const localUser = localStorage.getItem("localUser");
  console.log(user.role);
  console.log(localUser);

  const userRole = user.role || localUser;

  console.log({ userRole });

  return (
    <div className={classes.root}>
      <DashboardRoundedIcon className={classes.icon} color="primary" />
      <h1>Dashboard</h1>
      <div className={classes.boxes}>
        <Grid container spacing={3}>
          <AllOrders isAdmin={userRole === "admin"} />
          {userRole === "admin" ? (
            <>
              <AwaitingOrders />
              <SearchOrders />
              <NewOrders />
            </>
          ) : null}
        </Grid>
      </div>
    </div>
  );
};

export default Dashboard;
