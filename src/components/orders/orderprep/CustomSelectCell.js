import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(0),
        minWidth: 80,
    },
    selectEmpty: {
        marginTop: theme.spacing(1),
    },
}));

const OrderStatus = ({ isEdit, row, name, onChange }) => {
    const classes = useStyles();

    return (
        <FormControl className={classes.formControl}>
            <Select
                value={row[name]}
                onChange={onChange}
                displayEmpty
                className={classes.selectEmpty}
                inputProps={{ 'aria-label': 'Without label' }}
            >
                <MenuItem value="awaiting">awaiting</MenuItem>
                <MenuItem value="sent">sent</MenuItem>
                <MenuItem value="delivered">delivered</MenuItem>
            </Select>
        </FormControl>

    );
}


export default OrderStatus 