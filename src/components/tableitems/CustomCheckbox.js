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

    return (
        <FormGroup className={classes.formStyle} >
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
