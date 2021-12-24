import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import BorderColorIcon from "@material-ui/icons/BorderColor";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.primary,
    // marginTop: 39,
    marginLeft: 8,
    width: 254,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: "fit-content",
    lineHeight: "0.5rem",
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

const CostGetter = ({ quantity, calcCost }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <div className={classes.titleStyle}>
        <BorderColorIcon style={{ color: "#3F51B5", fontSize: "2rem" }} />
        <h3 style={{ display: "inline", marginLeft: "0.5rem" }}>Calculator</h3>
      </div>
      <div>
        {calcCost.isLoading ? (
          <h3>Calculating...</h3>
        ) : (
          <>
            <h3>
              {calcCost.totalCost && "Total Cost : $" + calcCost.totalCost}
            </h3>
            <h3>{calcCost.totalCost && "Quantity : " + quantity}</h3>
            <h3>
              {calcCost.totalCost && "Is Repeat : " + calcCost.isRepeatNumber}
            </h3>
          </>
        )}
      </div>
    </Paper>
  );
};

export default CostGetter;
