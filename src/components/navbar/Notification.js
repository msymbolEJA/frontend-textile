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
import { FormattedMessage } from "react-intl";

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
  warning: {
    backgroundColor: "#ffc166",
    padding: "0.5rem",
    borderRadius: 5,
  },
});

const Notification = ({ toggleDrawer, notification, handleNotification }) => {
  const classes = useStyles();

  return (
    <div className={classes.list}>
      <div className={classes.header}>
        <h2>
          <FormattedMessage id="notification" defaultMessage="Notification!" />
        </h2>
        <div className={classes.header}>
          <CancelIcon className="cp m-10" onClick={() => toggleDrawer(false)} />
        </div>
      </div>
      <div>
        {!notification?.results?.length ? (
          <div className={classes.warning}>
            <FormattedMessage
              id="noNotification"
              defaultMessage="No Notification!"
            />
          </div>
        ) : (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead className={classes.tableHead}>
                <TableRow>
                  <TableCell className={classes.tableHeadCell}>
                    <FormattedMessage id="id" defaultMessage="Id" />
                  </TableCell>
                  <TableCell className={classes.tableHeadCell}>
                    <FormattedMessage
                      id="mappingId"
                      defaultMessage="Mapping Id"
                    />
                  </TableCell>
                  <TableCell className={classes.tableHeadCell}>
                    <FormattedMessage id="message" defaultMessage="Message" />
                  </TableCell>
                  <TableCell className={classes.tableHeadCell}>
                    <FormattedMessage id="isRead?" defaultMessage="IsRead?" />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notification?.results?.map((item, index) => {
                  return (
                    <StyledTableRow key={index}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>
                        <a href={`/order-details/${item.mapping_id}`}>
                          {item.mapping_id}
                        </a>
                      </TableCell>
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
        )}
      </div>
    </div>
  );
};

export default Notification;
