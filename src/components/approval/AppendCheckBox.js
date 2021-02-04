import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles((theme) => ({
  formStyle: {
    alignItems: "center",
  },
}));

const AppendCheckBox = ({ row, appendCheckBox }) => {
  const classes = useStyles();
  const [checked, setChecked] = React.useState(false);
  //console.log(row);
  //console.log(row.id);

  const handleCheckBoxChange = (e, id) => {
    appendCheckBox(id);
    setChecked(!checked);
  };

  return (
    <FormGroup className={classes.formStyle}>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={(e) => handleCheckBoxChange(e, row.id)}
            name="approved"
            color="primary"
          />
        }
      />
    </FormGroup>
  );
};

export default AppendCheckBox;
