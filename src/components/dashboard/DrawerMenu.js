import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import { FormattedMessage } from "react-intl";
import InfoIcon from "@material-ui/icons/Info";
import mt from "moment-timezone";
import moment from "moment";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import "./DrawerStyle.css";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
});

export default function DrawerMenu({ lastDateOfOrder, healthCheck }) {
  const classes = useStyles();
  const [drawerMenu, setDrawerMenu] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerMenu(open);
  };

  const list = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <div
        style={{
          textAlign: "left",
          marginTop: "1rem",
          fontSize: "1rem",
          marginLeft: "20px",
        }}
      >
        <div>
          <FormattedMessage
            id={"currentTimeZone"}
            defaultMessage={"Current Time Zone"}
          />
          {" : "}
          <br />
          <b>
            {mt.tz(mt.tz.guess()).zoneAbbr()} - {mt.tz.guess()}
          </b>
        </div>
        <div>
          <br />
          <FormattedMessage
            id={"dateOfLastOrder"}
            defaultMessage={"Date of Last Order"}
          />
          {" : "}
          <br />
          <b>
            {lastDateOfOrder
              ? moment
                  .utc(lastDateOfOrder?.creation_tsz)
                  .local()
                  .format("MM-DD-YY HH:mm")
              : "-"}
          </b>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
          }}
        >
          <br />
          <br />
          <span>Health Check:</span>
          {healthCheck ? (
            <CheckCircleIcon style={{ color: "green", marginLeft: "0.5rem" }} />
          ) : (
            <CancelIcon style={{ color: "#ff3333", marginLeft: "0.5rem" }} />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Button
        onClick={toggleDrawer(true)}
        style={{ position: "absolute", left: "-40px", top: "-10px" }}
      >
        <InfoIcon style={{ color: healthCheck ? "green" : "#ff3333" }} />
      </Button>
      <Drawer open={drawerMenu} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </div>
  );
}
