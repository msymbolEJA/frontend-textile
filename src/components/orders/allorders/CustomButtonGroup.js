import React from 'react'
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  container: {
    maxHeight: "83vh",
  },
  table: {
    minWidth: 650,
  },
  btn: {
    width: 150,
    margin: theme.spacing(0.5),
  },
  btnGroup: {
    marginBottom: theme.spacing(1),
  },
  header: {
    fontSize: "1.5rem"
  }
}));

const CustomButtonGroup = ({ selectedTag, handleTagChange, tagsData }) => {
  const classes = useStyles();

  return (
    <div>
      <Typography className={classes.header}>{selectedTag === "all orders" ? selectedTag.toUpperCase() : selectedTag.toUpperCase().replace("_", " ") + " ORDERS"}</Typography>
      <div className={classes.btnGroup}
      >
        {tagsData.map((tag) => (
          <Button
            className={classes.btn}
            id={tag}
            key={tag}
            checked={selectedTag.indexOf(tag) > -1}
            onClick={(e) => handleTagChange(e)}
            variant="contained"
            color="primary"
          >
            {tag.replace("_", " ")}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default CustomButtonGroup
