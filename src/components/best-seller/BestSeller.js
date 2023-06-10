import { Card, Table, TableBody, TableCell, TableRow, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import moment from "moment";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { AppContext } from "../../context/Context";
import { getData, postData } from "../../helper/PostData";
import { toastErrorNotify, toastSuccessNotify } from "../otheritems/ToastNotify";
import ApexChart from "./ApexChart";
import CostGetter from "./CostGetter";
import PlatformCard from "./PlatformCard";
import SellerTable from "./SellerTable";
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
    display: "flex",
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
}));

const DateGetter = () => {
  const { user } = useContext(AppContext);
  const mobileView = useMediaQuery("(max-width:1024px)");

  let localRole = localStorage.getItem("localRole");

  const userRole = user?.role || localRole;
  const classes = useStyles();
  const beginnerDateRef = useRef();
  const endDateRef = useRef();
  const [bestSeller, setBestSeller] = useState({
    bestRows: null,
    isLoading: false,
  });
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [filteredPlatform, setFilteredPlatform] = useState("all");

  const [quantity, setQuantity] = useState(0);
  const [calcCost, setCalcCost] = useState({
    totalCost: null,
    isLoading: false,
    isRepeatNumber: 0,
  });

  const [platformsInfo, setPlatformsInfo] = useState(null);

  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const [missings, setMissings] = useState({
    MISSING_TYPE: null,
    MISSING_SILVER_TYPE_COST: null,
    MISSING_SILVER_QTY_COST: null,
    MISSING_GOLD_PRICES: null,
  });

  const platforms = {
    e: "Etsy",
    a: "Amzn",
    s: "Shopify",
    all: "All",
  };

  const getCost = () => {
    setCalcCost({ ...calcCost, isLoading: true });
    setBestSeller({ ...bestSeller, isLoading: true });

    getData(
      `${BASE_URL}etsy/calculate_cost/${beginnerDateRef.current.value}/${endDateRef.current.value}/${platforms[selectedPlatform]}/`,
    )
      .then(response => {
        setQuantity(response.data.TOTAL_COST.total_count);

        const {
          MISSING_TYPE,
          MISSING_SILVER_TYPE_COST,
          MISSING_SILVER_QTY_COST,
          MISSING_GOLD_PRICES,
        } = response.data;

        setMissings({
          MISSING_GOLD_PRICES: MISSING_GOLD_PRICES?.count ? MISSING_GOLD_PRICES : null,
          MISSING_SILVER_QTY_COST: MISSING_SILVER_QTY_COST?.count ? MISSING_SILVER_QTY_COST : null,
          MISSING_TYPE: MISSING_TYPE?.count ? MISSING_TYPE : null,
          MISSING_SILVER_TYPE_COST: MISSING_SILVER_TYPE_COST?.count
            ? MISSING_SILVER_TYPE_COST
            : null,
        });

        setPlatformsInfo(response.data.PLATFORM_TOTAL_COST);

        setBestSeller({
          ...bestSeller,
          bestRows: response.data.PLATFORM_DETAIL,
          isLoading: false,
        });

        setCalcCost({
          ...calcCost,
          totalCost: response.data.TOTAL_COST.total_cost,
          isLoading: false,
          isRepeatNumber: response.data.TOTAL_COST.is_repeat ?? 0,
        });
      })
      .catch(() => {
        setPlatformsInfo({});
      });
  };

  useEffect(() => {
    endDateRef.current.value = moment().format("YYYY-MM-DD");
    beginnerDateRef.current.value = moment().subtract(1, "months").format("YYYY-MM-DD");
  }, []);

  const handleFileUpload = e => {
    e.stopPropagation();
    let fs = e.target.files[0];
    if (fs) {
      setIsUploadingFile(true);

      var data = new FormData();
      data.append("file", fs);

      let path = `${BASE_URL}etsy/gold_file_upload/`;
      postData(path, data)
        .then(res => {
          console.log(res);
          toastSuccessNotify("Success uploading file");
        })
        .catch(err => {
          console.log(err.response);
          toastErrorNotify("Error uploading file");
        })
        .finally(() => {
          setIsUploadingFile(false);
        });
    }
  };

  const PlatformButton = ({ id, label }) => {
    return (
      <Button
        variant="contained"
        checked={selectedPlatform === id}
        disabled={calcCost.isLoading}
        onClick={e => setSelectedPlatform(id)}
        style={{
          backgroundColor: selectedPlatform === id ? "#3F51B5" : null,
          color: selectedPlatform === id ? "white" : null,
        }}
      >
        <FormattedMessage id={id} defaultMessage={label} />
      </Button>
    );
  };

  const bestRows = bestSeller?.bestRows?.filter(
    item =>
      selectedPlatform !== "all" ||
      filteredPlatform === "all" ||
      item.shop === platforms[filteredPlatform],
  );

  console.log("bestRows", bestRows);

  return (
    <div>
      <h2 className={classes.header}>
        <FormattedMessage id="topSeller" />
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
            <div className={classes.platformBtnWrapper}>
              <PlatformButton label="E" id="e" />
              <PlatformButton label="S" id="s" />
              <PlatformButton label="A" id="a" />
              <PlatformButton label="All" id="all" />
            </div>

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
                  onClick={getCost}
                  disabled={calcCost.isLoading || bestSeller.isLoading}
                >
                  <FormattedMessage id="getTypes" defaultMessage="Get Types" />
                </Button>
                <Button
                  variant="outlined"
                  component="label"
                  className={classes.btn}
                  color="primary"
                  disabled={calcCost.isLoading || bestSeller.isLoading || isUploadingFile}
                  startIcon={<CloudUploadIcon />}
                >
                  <FormattedMessage id="uploadFile" defaultMessage="Upload File" />
                  <input
                    type="file"
                    accept=".xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .csv"
                    onChange={handleFileUpload}
                    id="file-upload"
                    hidden
                  />
                </Button>
              </div>
            </div>
          </Paper>
        </div>
        {quantity && userRole === "admin" ? (
          <CostGetter
            endDateRef={endDateRef}
            beginnerDateRef={beginnerDateRef}
            calcCost={calcCost}
            quantity={quantity}
          />
        ) : null}
      </div>
      {missings && (
        <div className={classes.missingTable}>
          {[
            "MISSING_TYPE",
            "MISSING_GOLD_PRICES",
            "MISSING_SILVER_TYPE_COST",
            "MISSING_SILVER_QTY_COST",
          ].map((item, i) => {
            if (missings?.[item]?.count && missings?.[item]?.data?.length)
              return (
                <Card style={{ width: mobileView ? "90%" : 900 }} key={i}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={2} style={{ textAlign: "center", background: "red" }}>
                          <h1 style={{ fontSize: 16, color: "white" }}>
                            <FormattedMessage
                              id={item.replaceAll("_", " ")}
                              defaultMessage={item.replaceAll("_", " ")}
                            />
                          </h1>
                        </TableCell>

                        <TableCell scope="row" style={{ wordBreak: "break-all" }}>
                          {missings?.[item]?.data.map((id, i) => {
                            return (
                              <React.Fragment key={id}>
                                <a href={`order-details/${id}`} alt={id}>
                                  {id}
                                </a>
                                {i === missings?.[item]?.data?.length - 1 ? "" : ","}
                              </React.Fragment>
                            );
                          })}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Card>
              );
            else return <React.Fragment key={i} />;
          })}
        </div>
      )}

      <div
        className={classes.platformCardWrapper}
        style={{
          flexDirection: mobileView ? "column" : "row",
        }}
      >
        {userRole === "admin" &&
          platformsInfo &&
          Object.keys(platformsInfo).map(name => {
            const item = platformsInfo[name];
            return (
              <PlatformCard
                name={name}
                cost14K={item?.["14K_total_cost"]}
                qty14K={item?.["14K_total_count"]}
                silverCost={item?.["silver_total_cost"]}
                silverQty={item?.["silver_total_count"]}
                totalCost={item?.["total_cost"]}
                totalQty={item?.["total_count"]}
              />
            );
          })}
      </div>

      {selectedPlatform === "all" && bestSeller.bestRows && (
        <div className={classes.filterButtonsWrapper}>
          <Button
            variant="contained"
            checked={filteredPlatform === "e"}
            disabled={calcCost.isLoading}
            onClick={e => setFilteredPlatform("e")}
            style={{
              backgroundColor: filteredPlatform === "e" ? "#3F51B5" : null,
              color: filteredPlatform === "e" ? "white" : null,
            }}
          >
            <FormattedMessage id={"e"} defaultMessage={"E"} />
          </Button>

          <Button
            variant="contained"
            checked={filteredPlatform === "s"}
            disabled={calcCost.isLoading}
            onClick={e => setFilteredPlatform("s")}
            style={{
              backgroundColor: filteredPlatform === "s" ? "#3F51B5" : null,
              color: filteredPlatform === "s" ? "white" : null,
            }}
          >
            <FormattedMessage id={"s"} defaultMessage={"S"} />
          </Button>

          <Button
            variant="contained"
            checked={filteredPlatform === "a"}
            disabled={calcCost.isLoading}
            onClick={e => setFilteredPlatform("a")}
            style={{
              backgroundColor: filteredPlatform === "a" ? "#3F51B5" : null,
              color: filteredPlatform === "a" ? "white" : null,
            }}
          >
            <FormattedMessage id={"a"} defaultMessage={"A"} />
          </Button>

          <Button
            variant="contained"
            checked={filteredPlatform === "all"}
            disabled={calcCost.isLoading}
            onClick={e => setFilteredPlatform("all")}
            style={{
              backgroundColor: filteredPlatform === "all" ? "#3F51B5" : null,
              color: filteredPlatform === "all" ? "white" : null,
            }}
          >
            <FormattedMessage id={"all"} defaultMessage={"ALL"} />
          </Button>
        </div>
      )}

      <div
        style={{
          marginBottom: "70px",
          display: "flex",
          flexDirection: "column-reverse",
          justifyContent: "center",
        }}
      >
        {bestRows && bestRows?.length ? <SellerTable bestRows={bestRows} /> : null}
        {bestRows?.length === 0 && (
          <Typography variant="h5" style={{ marginTop: 10 }}>
            <FormattedMessage id={"noBestSeller"} defaultMessage={"noBestSeller"} />
          </Typography>
        )}
        {bestRows && bestRows?.length ? <ApexChart data={bestRows} /> : null}
      </div>
    </div>
  );
};

export default DateGetter;
