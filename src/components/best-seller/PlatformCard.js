import {
  Card,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import React from 'react';

const PlatformCard = ({ name, cost14K, qty14K, silverCost, silverQty, totalCost, totalQty }) => {
  return (
    <Card>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell colSpan={4} style={{ textAlign: 'center', background: 'lightblue' }}>
                <h1 style={{ fontSize: 17, padding: 0, margin: 0 }}> {name}</h1>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell scope="row">14K COST</TableCell>

              <TableCell scope="row">
                <h1 style={{ fontSize: 17, padding: 0, margin: 0 }}>${cost14K?.toFixed(2)}</h1>
              </TableCell>
              <TableCell scope="row">14K QTY</TableCell>

              <TableCell scope="row">
                <h1 style={{ fontSize: 17, padding: 0, margin: 0 }}>{qty14K}</h1>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell scope="row">SILVER COST</TableCell>

              <TableCell scope="row">
                <h1 style={{ fontSize: 17, padding: 0, margin: 0 }}>${silverCost?.toFixed(2)}</h1>
              </TableCell>
              <TableCell scope="row">SILVER QTY</TableCell>

              <TableCell scope="row">
                <h1 style={{ fontSize: 17, padding: 0, margin: 0 }}>{silverQty}</h1>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell scope="row">TOTAL COST</TableCell>

              <TableCell scope="row">
                <h1 style={{ fontSize: 17, padding: 0, margin: 0 }}>${totalCost?.toFixed(2)}</h1>
              </TableCell>
              <TableCell scope="row">TOTAL QTY</TableCell>

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
