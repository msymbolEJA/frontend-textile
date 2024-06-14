import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import moment from "moment";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { AppContext } from "../../context/Context";
import { getData } from "../../helper/PostData";
import ApexChart from "./ApexChart";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const useStyles = makeStyles(theme => ({
  top: {
    display: "flex",
    justifyContent: "center",
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.primary,
    // marginTop: 39,
    margin: "auto",
    width: "fit-content",
    display: "flex",
    flexDirection: "column",
    // justifyContent: "space-evenly",
    alignItems: "center",
    // height: 400,
    fontFamily: "Courier New",
    border: "1px solid lightgrey",
    borderRadius: "5px",
  },
  btn: {
    width: "175px",
    margin: "5px",
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
  header: {
    margin: 10,
    marginTop: 75,
    textAlign: "center",
    fontSize: "2rem",
  },
  getBtnDiv: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  missingTable: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    flexDirection: "column",
    marginTop: 20,
  },
  platformBtnWrapper: {
    maxWidth: 600,
    display: "flex",
    flexWrap: "wrap",

    gap: 10,
    borderBottom: "2px solid gray",
    width: "100%",
    justifyContent: "center",
    paddingBottom: 10,
  },
  platformCardWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  filterButtonsWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  uploadButton: {
    display: "inline-block",
    cursor: "pointer",
  },
  boldText: {
    fontWeight: "bold",
  },
  darkTableRow: {
    backgroundColor: theme.palette.grey[100],
  },
  tContainer: {
    marginBottom: theme.spacing(2),
    width: "fit-content",
    margin: "0 auto",
  },
}));

const WorkLoad = () => {
  const { user } = useContext(AppContext);
  const mobileView = useMediaQuery("(max-width:1024px)");

  let localRole = localStorage.getItem("localRole");

  const classes = useStyles();
  const beginnerDateRef = useRef();
  const endDateRef = useRef();
  const [data, setData] = useState({
    list: [],
    graphData: [],
    isLoading: false,
    isFetched: false,
  });

  const getStatistics = () => {
    setData(prevState => ({ ...prevState, isLoading: true }));
    getData(
      `${BASE_URL}etsy/workflow_istatistic/?start_date=${new Date(beginnerDateRef.current.value)
        ?.toISOString()
        ?.slice(0, 19)}&end_date=${new Date(endDateRef.current.value)
        ?.toISOString()
        ?.slice(0, 19)}`,
    )
      .then(({ data: { istatistic, list } }) => {
        const graphData = Object.entries(istatistic ?? {}).map(([key, value]) => {
          return Object.entries(value).map(([key2, value2]) => {
            return { type: key2, count: value2, title: key };
          });
        });
        setData(prevState => ({
          ...prevState,
          graphData,
          list,
        }));
      })
      .catch(() => {
        // setPlatformsInfo({});
      })
      .finally(() => {
        setData(prevState => ({ ...prevState, isLoading: false, isFetched: true }));
      });
  };

  useEffect(() => {
    endDateRef.current.value = moment().format("YYYY-MM-DD");
    beginnerDateRef.current.value = moment().subtract(1, "months").format("YYYY-MM-DD");
  }, []);

  return (
    <div>
      <h2 className={classes.header}>
        <FormattedMessage id="workload" />
      </h2>
      <div
        style={{
          display: "flex",
          alignItems: mobileView ? "center" : "flex-start",
          justifyContent: "center",
          flexDirection: mobileView ? "column" : "row",
        }}
      >
        <div className={classes.top}>
          <Paper className={classes.paper}>
            <div
              style={{
                display: mobileView ? "block" : "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className={classes.inputs}>
                <label htmlFor="beginnerDate" className={classes.label}>
                  <FormattedMessage id="startDate" defaultMessage="Start Date" />:
                </label>
                (<FormattedMessage id="include" defaultMessage="Include" />)
                <input ref={beginnerDateRef} type="date" />
              </div>
              <div className={classes.inputs}>
                <label htmlFor="endDate" className={classes.label}>
                  <FormattedMessage id="endDate" defaultMessage="End Date" />:
                </label>
                (<FormattedMessage id="exclude" defaultMessage="Exclude" />)
                <input ref={endDateRef} type="date" />
              </div>
              <div className={classes.getBtnDiv}>
                <Button
                  variant="contained"
                  className={classes.btn}
                  color="primary"
                  onClick={getStatistics}
                  disabled={data.isLoading}
                >
                  <FormattedMessage id="search" defaultMessage="Calculate Cost" />
                </Button>
              </div>
            </div>
          </Paper>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: [...Array(data?.graphData?.length).keys()]
            .map(item => "auto")
            .join(" "),
        }}
      >
        {data?.graphData?.map((item, index) => {
          return (
            <div key={index}>
              <ApexChart data={item} title={item?.[0]?.title} />
            </div>
          );
        })}
      </div>

      {data?.isFetched ? (
        <>
          {data?.list?.length ? (
            <div
              style={{
                marginTop: "50px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <TableContainer className={classes.tContainer} component={Paper}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow className={classes.tableCellHeader}>
                      <TableCell className={classes.boldText} align="center">
                        <FormattedMessage id="user" defaultMessage="User" />
                      </TableCell>

                      <TableCell className={classes.boldText} align="center">
                        <FormattedMessage id="SKU" defaultMessage="SKU" />
                      </TableCell>

                      <TableCell className={classes.boldText} align="center">
                        <FormattedMessage id="station" defaultMessage="station" />
                      </TableCell>

                      <TableCell className={classes.boldText} align="center">
                        <FormattedMessage id="date" defaultMessage="Date" />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.list?.map((item, skuIndex) => {
                      return (
                        <TableRow
                          className={skuIndex % 2 === 1 ? classes.darkTableRow : null}
                          key={skuIndex}
                        >
                          <TableCell align="center" className={classes.boldText}>
                            {item?.user}
                          </TableCell>

                          <TableCell align="center" className={classes.boldText}>
                            {item?.mapping}
                          </TableCell>
                          <TableCell align="center" className={classes.boldText}>
                            {item?.station_updated}
                          </TableCell>

                          <TableCell align="center" className={classes.boldText}>
                            {moment.utc(item?.timestamp).local().format("MM-DD-YY HH:mm")}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ) : (
            <h3>
              {" "}
              <FormattedMessage id={"noData"} defaultMessage={"No Data"} />
            </h3>
          )}
        </>
      ) : null}
    </div>
  );
};

export default WorkLoad;
