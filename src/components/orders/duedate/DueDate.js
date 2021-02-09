import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
// Icons
import data from "../../../helper/DueDateData";
import style from "./styles";
import { getHeaders, getBodyItems } from "../../../helper/Functions";

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);
  
  
  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      marginTop: theme.spacing(3),
      overflowX: "auto",
    },
    table: {
      minWidth: 650,
    },
    selectTableCell: {
      width: 60,
    },
  }));

export default function DueDate() {
  let headers = getHeaders(data);
  let bodyItems = getBodyItems(data);
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Table className={classes.table} aria-label="caption table" size="small">
        <caption>Can be added Company Name!</caption>
        <TableHead>
          <TableRow>
            {headers?.map((header, index) => (
              <>
                <StyledTableCell key={index} align="center">
                  {header.slice(-5)}
                </StyledTableCell>
              </>
            ))}
          </TableRow>
        </TableHead>
        {bodyItems?.map((item, index) => (
          <tr style={style.tableCell} key={index}>
            {item?.map((elm, ind) => (
              <>
                <tr key={ind} >
                  <a href="/">{elm.id}</a>
                </tr>
                <hr />
              </>
            ))}
          </tr>
        ))}
      </Table>
    </Paper>
  );
}
