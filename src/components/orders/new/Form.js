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
              id="desert"
              label="Desert"
              name="desert"
              autoComplete="desert"
              onChange={handleChange}
              autoFocus
              value={info.desert}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              name="calories"
              label="Calories"
              type="number"
              id="calories"
              autoComplete="calories"
              onChange={handleChange}
              value={info.calories}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              name="fat"
              label="Fat"
              type="number"
              id="fat"
              autoComplete="fat"
              onChange={handleChange}
              value={info.fat}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              name="carbs"
              label="Carbs"
              type="number"
              id="carbs"
              autoComplete="carbs"
              onChange={handleChange}
              value={info.carbs}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              name="protein"
              label="Protein"
              type="number"
              id="protein"
              autoComplete="protein"
              onChange={handleChange}
              value={info.protein}
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
