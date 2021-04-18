import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InfoIcon from "@material-ui/icons/Info";
import mt from "moment-timezone";
import moment from "moment";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) => ({
  ulStyle: {
    listStyle: "none",
    position: "absolute",
    top: "250px",
    left: "-88px",
    transform: "translateY(-50%)",
  },
  aStyle: {
    display: "block",
    marginLeft: "-2px",
    fontSize: "1rem",
    height: "60px",
    width: "60px",
    borderRadius: "0 25px 25px 0",
    border: "2px solid #000",
    background: "#fff",
    marginBottom: "1em",
    transition: "all 0.4s ease",
    //color: "#2980b9",
    textDecoration: "none",
    lineHeight: "30px",
    position: "relative",
    "&:hover": {
      cursor: "pointer",
      padding: "10px",
      width: "250px",
      color: "#fff",
      height: "250px",
      backgroundColor: "rgba(39, 174, 96, 1)",
      "& span": {
        left: 0,
      },
    },
    backgroundColor: "rgba(39, 174, 96, 0.1)",
    borderColor: "#27ae60",
    color: "#fff",
  },
  aErrorStyle: {
    display: "block",
    marginLeft: "-2px",
    fontSize: "1em",
    height: "60px",
    width: "60px",
    borderRadius: "0 25px 25px 0",
    border: "2px solid #000",
    background: "#fff",
    marginBottom: "1em",
    transition: "all 0.4s ease",
    //color: "#2980b9",
    textDecoration: "none",
    lineHeight: "30px",
    position: "relative",
    "&:hover": {
      cursor: "pointer",
      padding: "10px",
      width: "250px",
      color: "#fff",
      height: "250px",
      backgroundColor: "rgba(255, 37, 15, 1)",
      "& span": {
        left: 0,
      },
    },
    backgroundColor: "rgba(255, 37, 15, 0.1)",
    borderColor: "rgba(255, 37, 15)",
    color: "#fff",
  },
  spanStyle: {
    padding: "0 30px 0 15px",
    position: "absolute",
    left: "-320px",
    transition: "left 0.4s ease",
  },
  iconStyle: {
    position: "absolute",
    top: "50%",
    right: "20px",
    transform: "translateY(-50%)",
    fontSize: "2rem",
    color: "rgba(39, 174, 96, 1)",
  },
  iconErrorStyle: {
    position: "absolute",
    top: "50%",
    right: "20px",
    transform: "translateY(-50%)",
    fontSize: "2rem",
    color: "rgba(255, 37, 15, 1)",
  },
}));

const FloatingMenu = ({ lastDateOfOrder, healthCheck }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <ul className={classes.ulStyle}>
        <li>
          <div
            className={healthCheck?.check ? classes.aStyle : classes.aErrorStyle}
          >
            <span className={classes.spanStyle}>
              <FormattedMessage
                id={"currentTimeZone"}
                defaultMessage={"Current Time Zone"}
              />
              :
              <br />
              {mt.tz(mt.tz.guess()).zoneAbbr()} - {mt.tz.guess()}
              <br />
              <br />
              <FormattedMessage
                id={"dateOfLastOrder"}
                defaultMessage={"Date of Last Order"}
              />
              :
              <br />
              {lastDateOfOrder
                ? moment
                    .utc(lastDateOfOrder?.creation_tsz)
                    .local()
                    .format("MM-DD-YY HH:mm")
                : "-"}
              <br />
              <br />
              <div>
                HealthCheck:
                {healthCheck?.check ? (
                  <CheckCircleIcon
                    style={{
                      marginLeft: "10px",
                      position: "relative",
                      top: "5px",
                    }}
                  />
                ) : (
                  <CancelIcon
                    style={{
                      marginLeft: "10px",
                      position: "relative",
                      top: "5px",
                    }}
                  />
                )}
              </div>
            </span>
            <InfoIcon
              className={
                healthCheck?.check ? classes.iconStyle : classes.iconErrorStyle
              }
            />
          </div>
        </li>
      </ul>
    </React.Fragment>
  );
};

export default FloatingMenu;
