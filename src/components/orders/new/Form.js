import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    height: "auto",
    marginTop: "0.7rem",
  },
  paper: {
    margin: theme.spacing(3, 6),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(2, 0, 1),
  },
}));

export default function InputForm({ handleSubmit, handleChange, info }) {
  const classes = useStyles();

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            New Order
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              id="Name"
              label="Name"
              name="Name"
              autoComplete="Name"
              onChange={handleChange}
              autoFocus
              value={info.Name}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              name="Miles_per_Gallon"
              label="Miles per Gallon"
              type="number"
              id="Miles_per_Gallon"
              autoComplete="Miles_per_Gallon"
              onChange={handleChange}
              value={info.Miles_per_Gallon}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              name="Cylinders"
              label="Cylinders"
              type="number"
              id="Cylinders"
              autoComplete="Cylinders"
              onChange={handleChange}
              value={info.Cylinders}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              name="Displacement"
              label="Displacement"
              type="number"
              id="Displacement"
              autoComplete="Displacement"
              onChange={handleChange}
              value={info.Displacement}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              name="Horsepower"
              label="Horsepower"
              type="number"
              id="Horsepower"
              autoComplete="Horsepower"
              onChange={handleChange}
              value={info.Horsepower}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              name="Weight_in_lbs"
              label="Weight(lbs)"
              type="number"
              id="Weight_in_lbs"
              autoComplete="Weight_in_lbs"
              onChange={handleChange}
              value={info.Weight_in_lbs}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              name="Acceleration"
              label="Acceleration"
              type="number"
              id="Acceleration"
              autoComplete="Acceleration"
              onChange={handleChange}
              value={info.Acceleration}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              name="Year"
              label="Year"
              type="text"
              id="Year"
              autoComplete="Year"
              onChange={handleChange}
              value={info.Year}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              name="Origin"
              label="Origin"
              type="text"
              id="Origin"
              autoComplete="Origin"
              onChange={handleChange}
              value={info.Origin}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Create
            </Button>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
