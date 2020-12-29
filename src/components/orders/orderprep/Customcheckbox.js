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

const CustomCheckbox = ({ row, name, onChange }) => {
    const classes = useStyles();
    const checkedB = row[name]

    return (
        <FormGroup className={classes.formStyle} >
            <FormControlLabel
                control={
                    <Checkbox
                        checked={checkedB}
                        onChange={onChange}
                        name="checkedB"
                        color="primary"
                    />
                }
            />
        </FormGroup>
    );
}

export default CustomCheckbox
