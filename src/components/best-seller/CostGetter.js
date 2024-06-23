import { useMediaQuery } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.primary,
    // marginTop: 39,
    marginLeft: 8,
    width: 320,
    height: 209,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    lineHeight: "1.5rem",
    border: "1px solid lightgrey",
  },
  titleStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    // minHeight: "5rem",
    borderBottom: "1px solid black",
  },
}));

const CostGetter = ({ calcCost, title }) => {
  const classes = useStyles();

  const mobileView = useMediaQuery("(max-width:1024px)");

  return (
    <Paper className={classes.paper} style={{ marginTop: mobileView ? 20 : 0 }}>
      <div className={classes.titleStyle}>
        <BorderColorIcon style={{ color: "#3F51B5", fontSize: "1.4rem", marginRight: 10 }} />
        <h3 style={{ display: "inline", marginLeft: "0.5rem" }}>
          <FormattedMessage id={title.toLowerCase()} defaultMessage={title} />
        </h3>
      </div>
      <div>
        {calcCost.isLoading ? (
          <h3>Calculating...</h3>
        ) : (
          <>
            <h3>
              {" "}
              <FormattedMessage id="Total Cost" defaultMessage="Total Cost" />
              {" : $" + calcCost?.total_cost?.toFixed(2)}
            </h3>
            <h3>
              <FormattedMessage id="Total Fabric (m)" defaultMessage="Total Fabric (m)" />
              {" : " + calcCost?.total_fabric?.toFixed(2)} m
            </h3>
            <h3>
              <FormattedMessage id="Total Product" defaultMessage="Total Product" />
              {" : " + calcCost.total_product}
            </h3>
          </>
        )}
      </div>
    </Paper>
  );
};

export default CostGetter;
