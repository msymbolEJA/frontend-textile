import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import PublishIcon from '@material-ui/icons/Publish';

const useStyles = makeStyles(theme => ({
    root: {
    height: "6rem",
    display: "flex",
    justifyContent: "center",
    flexDirection:"column",
    alignItems: "center",
    width: "3rem",
    },
    icon:{
        fontSize:"2rem",
        marginLeft:"2.5rem",
        cursor:"pointer"
    },
    vFile:{
        marginLeft:"2.5rem",
    }
}));

const UploadFile = ({uploadFile}) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <a href="http://144.202.67.136:8080/media/mapping/1/Screenshot_2.png" className={classes.vFile} target="_blank" rel="noreferrer">View File</a>
            <label htmlFor="myInput">
                <PublishIcon className={classes.icon} onClick={uploadFile} />
            </label>
            <input
                onChange={uploadFile}
                id="myInput"
                style={{display:'none'}}
                type={"file"}
            />
        </div>
    )
}

export default UploadFile
