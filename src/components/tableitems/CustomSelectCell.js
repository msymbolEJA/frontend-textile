import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {statusData} from "../../helper/Constants"

const useStyles = makeStyles((theme) => ({
    opt:{
        fontSize: "0.9rem",
        width: "100px"
    }
}));

const OrderStatus = ({ row, name, onSelectChange }) => {
    const classes = useStyles();

    return (
        <div>
            <select
            className={classes.opt}
                id={name}
                value={row[name]}
                name={name}
                onChange={(e) => onSelectChange(e, row)}
                onClick={(e) => e.stopPropagation()}
            ><optgroup>
                {statusData.map((item, index) => (
                    <option key={`${index}+${item}`} value={item}>{item}</option>
                    
                    ))}
                </optgroup>
            </select>
        </div>

    );
}


export default OrderStatus  