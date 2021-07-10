import React, { useRef, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { getData } from "../../helper/PostData";
import Button from "@material-ui/core/Button";
import moment from "moment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { bestSellerColumns } from "../../helper/Constants";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const useStyles = makeStyles((theme) => ({
  top: {
    display: "flex",
    justifyContent: "center",
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.primary,
    // marginTop: 39,
    marginLeft: 8,
    width: "fit-content",
    display: "flex",
    flexDirection: "row",
    // justifyContent: "space-evenly",
    alignItems: "center",
    // height: 400,
    border: "1px solid lightgrey",
    borderRadius: "5px",
  },
  titleStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: "6rem",
    borderBottom: "1px solid black",
  },
  btn: {
    backgroundColor: "#007BFF",
    color: "white",
    textTransform: "none",
    marginTop: "20px",
    "&:hover": {
      backgroundColor: "#0069D9",
    },
  },
  inputs: {
    display: "flex",
    flexDirection: "column",
    margin: "10px",
  },
  label: {
    margin: "10px",
    fontSize: "1.5rem",
  },
  tContainer: {
    padding: 10,
    width: "fit-content",
    minWidth: "500px",
    marginTop: 10,
  },
  thead: {
    backgroundColor: "#6495ED",
  },
  darkTableRow: {
    backgroundColor: "#F2F2F2",
  },
  tableCell: {
    fontFamily: "Courier New",
  },
  tablePaper: {
    marginTop: "10px",
    border: "1px solid lightgrey",
    borderRadius: "5px",
  },
  bottom: {
    display: "flex",
    justifyContent: "center",
  },
  header: {
    margin: 10,
    marginTop: 75,
    textAlign: "center",
    fontSize: "2rem",
  },
}));

const DateGetter = () => {
  const classes = useStyles();
  const beginnerDateRef = useRef(null);
  const endDateRef = useRef(null);
  const [bestSeller, setBestSeller] = useState({
    bestRows: null,
    isLoading: false,
  });

  const getDate = () => {
    console.log("B", beginnerDateRef.current.value);
    console.log("E", endDateRef.current.value);
    getCost();
  };

  const getCost = () => {
    setBestSeller({ ...bestSeller, isLoading: true });
    getData(
      `${BASE_URL}etsy/order_number_list/?creation_tsz__iexact=&creations_tsz__lte=${endDateRef.current.value}+00%3A00%3A00&creation_tsz__gte=${beginnerDateRef.current.value}+00%3A00%3A00`
    ).then((response) => {
      console.log(response.data.results);
      setBestSeller({ isLoading: false, bestRows: response.data.results });
    });
  };

  useEffect(() => {
    endDateRef.current.value = moment().format("YYYY-MM-DD");
    beginnerDateRef.current.value = moment()
      .subtract(1, "months")
      .format("YYYY-MM-DD");
  }, []);

  useEffect(() => {
    console.log(bestSeller);
  }, [bestSeller]);

  return (
    <div>
      <h2 className={classes.header}>Best Seller</h2>
      <div className={classes.top}>
        <Paper className={classes.paper}>
          <div className={classes.inputs}>
            <label htmlFor="beginnerDate" className={classes.label}>
              Beginner Date:
            </label>
            <input ref={beginnerDateRef} type="date" />
          </div>
          <div className={classes.inputs}>
            <label htmlFor="endDate" className={classes.label}>
              End Date:
            </label>
            <input ref={endDateRef} type="date" />
          </div>
          <Button variant="contained" className={classes.btn} onClick={getDate}>
            Get
          </Button>
        </Paper>
      </div>
      {bestSeller.bestRows && (
        <div className={classes.bottom}>
          <div className={classes.tablePaper}>
            <TableContainer className={classes.tContainer}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead className={classes.thead}>
                  <TableRow>
                    {bestSellerColumns?.map((item) => (
                      <TableCell
                        className={classes.tableCellHeader}
                        align="center"
                        key={item.id}
                      >
                        {item.name} {item?.name2 ? `/ ${item?.name2}` : null}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bestSeller?.bestRows?.map((row, index) => (
                    <TableRow
                      key={row?.id}
                      className={index % 2 === 1 ? classes.darkTableRow : null}
                    >
                      {bestSellerColumns?.map((item, i) => (
                        <TableCell
                          key={i}
                          className={classes.tableCell}
                          align="center"
                        >
                          {row[item?.objKey]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateGetter;
