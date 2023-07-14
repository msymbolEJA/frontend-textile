import {
  Card,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

const PlatformCard = ({ name, cost14K, qty14K, silverCost, silverQty, total_cost, totalQty }) => {
  return (
    <Card>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell colSpan={4} style={{ textAlign: "center", background: "lightblue" }}>
                <h1 style={{ fontSize: 17, padding: 0, margin: 0 }}> {name}</h1>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell scope="row">
                <FormattedMessage id={"14K COST"} defaultMessage={"14K COST"} />
              </TableCell>

              <TableCell scope="row">
                <h1 style={{ fontSize: 17, padding: 0, margin: 0 }}>${cost14K?.toFixed(2)}</h1>
              </TableCell>
              <TableCell scope="row">
                <FormattedMessage id={"14K QTY"} defaultMessage={"14K QTY"} />
              </TableCell>

              <TableCell scope="row">
                <h1 style={{ fontSize: 17, padding: 0, margin: 0 }}>{qty14K}</h1>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell scope="row">
                <FormattedMessage id={"SILVER COST"} defaultMessage={"SILVER COST"} />
              </TableCell>

              <TableCell scope="row">
                <h1 style={{ fontSize: 17, padding: 0, margin: 0 }}>${silverCost?.toFixed(2)}</h1>
              </TableCell>
              <TableCell scope="row">
                <FormattedMessage id={"SILVER QTY"} defaultMessage={"SILVER QTY"} />
              </TableCell>

              <TableCell scope="row">
                <h1 style={{ fontSize: 17, padding: 0, margin: 0 }}>{silverQty}</h1>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell scope="row">
                <FormattedMessage id={"TOTAL COST"} defaultMessage={"TOTAL COST"} />
              </TableCell>

              <TableCell scope="row">
                <h1 style={{ fontSize: 17, padding: 0, margin: 0 }}>${total_cost?.toFixed(2)}</h1>
              </TableCell>
              <TableCell scope="row">
                <FormattedMessage id={"TOTAL QTY"} defaultMessage={"TOTAL QTY"} />
              </TableCell>

              <TableCell scope="row">
                <h1 style={{ fontSize: 17, padding: 0, margin: 0 }}>{totalQty}</h1>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default PlatformCard;
