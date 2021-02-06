/* eslint-disable array-callback-return */
import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import SummaryTable from "./SummaryTable";
import { AppContext } from "../../context/Context";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
// Icons
import {
  ThumbUp as ThumbUpIcon,
  ListAlt as ListAltIcon,
  ViewList as ViewListIcon,
  FindInPage as FindInPageIcon,
  AddCircle as AddCircleIcon,
  LocalShipping as LocalShippingIcon,
  CardGiftcard as CardGiftcardIcon,
} from "@material-ui/icons";
import { getData } from "../../helper/PostData";
import {
  sortingArrayAdmin,
  sortingArrayUser,
  BASE_URL,
} from "../../helper/Constants";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 20,
    marginRight: 50,
    marginLeft: 50,
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
  const [orderSummary, setOrderSummary] = useState();
  const [workshopDueDates, setWorkshopDueDates] = useState();
  const [shipmentDueDates, setShipmentDueDates] = useState();
  const localUser = localStorage.getItem("localUser");

  const userRole = user.role || localUser;

  useEffect(() => {
    getData(`${BASE_URL}etsy/summary_order/`).then((response) => {
      const newResult = [];
      response.data[0].forEach((item) => {
        newResult.push({
          cell1: item.status.replace("_", " ").replace("-", " ").toUpperCase(),
          cell2: item.status_count,
        });
      });
      response.data[1].forEach((item) => {
        if (item.is_repeat)
          newResult.push({ cell1: "REPEAT", cell2: item.status_count });
      });
      response.data[2].forEach((item) => {
        if (item.is_followup)
          newResult.push({ cell1: "FOLLOW UP", cell2: item.status_count });
      });
      const currentSortingArray =
        userRole === "admin" ||
        userRole === "shop_manager" ||
        userRole === "shop_packer"
          ? sortingArrayAdmin
          : sortingArrayUser;
      const newResult2 = currentSortingArray.map((object, i) => {
        let currentObject = newResult.find((x) => x.cell1 === object);
        if (!currentObject) currentObject = { cell1: object, cell2: 0 };
        return currentObject;
      });
      setOrderSummary(newResult2.length ? newResult2 : "NO ORDERS");
    });
  }, [userRole]);

  useEffect(() => {
    getData(`${BASE_URL}etsy/due_dates/`)
      .then((response) => {
        const newResult = [];
        const obj = response.data;
        Object.keys(obj).map((key, value) => {
          if (obj[key].is_late)
            newResult.push({ cell1: key, cell2: obj[key].values.length });
        });
        setWorkshopDueDates(newResult.length ? newResult : "NO ORDERS");
      })
      .catch((err) => {
        setWorkshopDueDates("NO ORDERS");
      });
  }, []);

  useEffect(() => {
    getData(`${BASE_URL}etsy/shipment_due_dates/`)
      .then((response) => {
        const newResult = [];
        const obj = response.data;
        Object.keys(obj).map((key, value) => {
          if (obj[key].is_late)
            newResult.push({ cell1: key, cell2: obj[key].values.length });
        });
        setShipmentDueDates(newResult.length ? newResult : "NO ORDERS");
      })
      .catch((err) => {
        setShipmentDueDates("NO ORDERS");
      });
  }, []);
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
              onClick={() => history.push(`/approval?&status=pending`)}
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
        <Grid container spacing={2}>
          <SummaryTable
            title="Orders"
            total={0}
            next="/all-orders"
            icon={<ListAltIcon className={classes.icon} color="primary" />}
            header1="STATUS"
            header2="COUNT"
            data={orderSummary}
          />
          <SummaryTable
            title="Behind of Workshop Schedule"
            total={0}
            next="/workshop-due-dates"
            icon={
              <LocalShippingIcon className={classes.icon} color="primary" />
            }
            header1="WORKSHOP DUE DATE"
            header2="QUANTITY"
            data={workshopDueDates}
          />
          {userRole === "admin" ||
          userRole === "shop_manager" ||
          userRole === "shop_packer" ? (
            <SummaryTable
              title="Behind of Shipment Schedule"
              total={0}
              next="/shipment-due-dates"
              icon={
                <CardGiftcardIcon className={classes.icon} color="primary" />
              }
              header1="SHIPMENT DUE DATE"
              header2="QUANTITY"
              data={shipmentDueDates}
            />
          ) : null}
        </Grid>
      </div>
    </div>
  );
};

export default Dashboard;
