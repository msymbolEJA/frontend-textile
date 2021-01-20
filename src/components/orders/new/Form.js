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
  warn: {
    color: "#cc5500",
    backgroundColor: "#FFF4E5",
    borderRadius: "5px",
    height: "2rem",
    fontSize: "1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "15rem"
  }
}));

export default function InputForm({ handleSubmit, handleChange, info }) {
  const classes = useStyles();
 
  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            New Order Creation
          </Typography>
          <div className={classes.warn}>
                <Typography>Please fill all the fields!</Typography>
              </div>
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              id="customer"
              label="Customer"
              name="customer"
              autoComplete="customer"
              type="text"
              onChange={handleChange}
              autoFocus
              value={info.customer}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              name="supplier"
              label="Supplier"
              type="text"
              id="supplier"
              autoComplete="supplier"
              onChange={handleChange}
              value={info.supplier}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              name="type"
              label="Type"
              type="text"
              id="type"
              autoComplete="type"
              onChange={handleChange}
              value={info.type}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              name="length"
              label="Length"
              type="text"
              id="length"
              autoComplete="length"
              onChange={handleChange}
              value={info.length}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              name="color"
              label="Color"
              type="text"
              id="color"
              autoComplete="color"
              onChange={handleChange}
              value={info.color}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              name="qty"
              label="Qty"
              type="text"
              id="qty"
              autoComplete="qty"
              onChange={handleChange}
              value={info.qty}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              name="size"
              label="Size"
              type="text"
              id="size"
              autoComplete="size"
              onChange={handleChange}
              value={info.size}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              name="start"
              label="Start"
              type="text"
              id="start"
              autoComplete="start"
              onChange={handleChange}
              value={info.start}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              name="space"
              label="Space"
              type="text"
              id="space"
              autoComplete="space"
              onChange={handleChange}
              value={info.space}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              name="explanation"
              label="Explanation"
              type="text"
              id="explanation"
              autoComplete="explanation"
              onChange={handleChange}
              value={info.explanation}
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
