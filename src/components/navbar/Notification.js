import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  list: {
    width: "auto",
    margin: 10,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  main: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "0 0.5rem",
  },
  tableHead: {
    backgroundColor: "black",
  },
  tableHeadCell: {
    color: "white",
  },
});

const Notification = ({ toggleDrawer, notification, handleNotification }) => {
  const classes = useStyles();

  console.log("Notification", notification);

  return (
    <div className={classes.list}>
      <div className={classes.header}>
        <h2>Notification</h2>
        <div className={classes.header}>
          <CancelIcon className="cp m-10" onClick={() => toggleDrawer(false)} />
        </div>
      </div>
      <div>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead className={classes.tableHead}>
              <TableRow>
                <TableCell className={classes.tableHeadCell}>Id</TableCell>
                <TableCell className={classes.tableHeadCell}>
                  Mapping Id
                </TableCell>
                <TableCell className={classes.tableHeadCell}>Message</TableCell>
                <TableCell className={classes.tableHeadCell}>
                  Is Read?
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notification?.results?.map((item, index) => {
                return (
                  <StyledTableRow key={index}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.mapping_id}</TableCell>
                    <TableCell>{item.message}</TableCell>
                    <TableCell>
                      <Checkbox
                        color="primary"
                        checked={item.is_read}
                        onChange={(e) => handleNotification(e, item.id, item)}
                      />
                    </TableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Notification;
