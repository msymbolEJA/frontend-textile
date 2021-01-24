import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
    formStyle: {
        alignItems: "center"
    }
}));

const CustomCheckbox = ({ row, name, onCheckboxChange }) => {
    const classes = useStyles();
    let checked = false;
    row[name] ? checked = true : checked = false

    // console.log(row.status)
    // console.log((row.status === "pending" | row.status === "awaiting"))
    const isDisable = (row.status === "pending" | row.status === "awaiting")

    return (
        <FormGroup className={classes.formStyle} style={{ pointerEvents: isDisable ? 'auto' : 'none' }} >
            <FormControlLabel
                control={
                    <Checkbox
                        checked={checked}
                        onChange={(e) => onCheckboxChange(e, row)}
                        name="approved"
                        color="primary"
                    />
                }
            />
        </FormGroup>
    );
}
 
export default CustomCheckbox
