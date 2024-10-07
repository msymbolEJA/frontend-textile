import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
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
import { convertToTitleCase } from "../../helper/convertToTitleCase";
import ApexChart from "./ApexChart";
import CostGetter from "./CostGetter";
import SellerTable from "./SellerTable";

import DatePicker from "react-multi-date-picker";
import Select from 'react-select'

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
  fullWidth: {
    width: "100%"
  }
}));

const DateGetter = () => {
  const { user } = useContext(AppContext);
  const mobileView = useMediaQuery("(max-width:1024px)");

  let localRole = localStorage.getItem("localRole");

  console.log("user", user);

  const userRole = user?.role || localRole;
  const classes = useStyles();
  const beginnerDateRef = useRef();
  const endDateRef = useRef();
  const [bestSeller, setBestSeller] = useState({
    bestRows: null,
    isLoading: false,
  });
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [searchedPlatform, setSearchedPlatform] = useState("");

  const [selectedYear, setSelectedYear] = useState(new Date());
  const options = [
    { value: 'january', label: 'Ocak' },
    { value: 'february', label: 'Şubat' },
    { value: 'march', label: 'Mart' },
    { value: 'april', label: 'Nisan' },
    { value: 'may', label: 'Mayıs' },
    { value: 'june', label: 'Haziran' },
    { value: 'july', label: 'Temmuz' },
    { value: 'august', label: 'Ağustos' },
    { value: 'september', label: 'Eylül' },
    { value: 'october', label: 'Ekim' },
    { value: 'november', label: 'Kasım' },
    { value: 'december', label: 'Aralık' }
  ];

  const [months, setMonths] = useState([])

  console.log(months)

  const [quantity, setQuantity] = useState(null);
  const [calcCost, setCalcCost] = useState({
    total_cost: 0,
    isLoading: false,
    total_product: 0,
    total_fabric: 0,
  });

  const [missings, setMissings] = useState({
    size_or_sku_error: [],
    fabric: [],
    unit_fabric: [],
    fabric_price: [],
    man_hour: [],
  });

  const [categoryVariationValues, setCategoryVariationValues] = useState({
    variation_1_value: null,
    variation_2_value: null,
  });

  const [categories, setCategories] = useState(null);

  const [perSKU, setPerSKU] = useState(null);

  const getCost = () => {
    setCalcCost({ ...calcCost, isLoading: true });
    setBestSeller({ ...bestSeller, isLoading: true });

    getData(
      `${BASE_URL}cogs/${selectedPlatform.replace("sku", "all")}/?start_date=${beginnerDateRef.current.value
      }&end_date=${endDateRef.current.value}`,
    )
      .then(response => {
        if (selectedPlatform === "dress") {
          setSearchedPlatform("dress");
          setCategoryVariationValues({
            variation_1_value: "size",
            variation_2_value: "color",
          });
          setQuantity(response.data?.product_cost?.total_product);
          setBestSeller(response.data);
          setCalcCost({
            ...calcCost,
            total_cost: response.data?.product_cost?.total_cost,
            total_fabric: response.data?.product_cost?.total_fabric,
            total_product: response.data?.product_cost?.total_product,
            isLoading: false,
          });
          setBestSeller({
            ...bestSeller,
            bestRows: response.data?.per_sku_size_color,
          });
          setMissings(response.data?.missing_data);
          setCategories(null);
          setPerSKU(null);
        } else if (selectedPlatform === "approne") {
          setSearchedPlatform("approne");
          setCategoryVariationValues({
            variation_1_value: "size",
            variation_2_value: process.env.REACT_APP_STORE_NAME === "Mina" ? "color" : "type",
          });
          setQuantity(response.data?.product_cost?.total_product);
          setCalcCost({
            ...calcCost,
            total_cost: response.data?.product_cost?.total_cost,
            total_fabric: response.data?.product_cost?.total_fabric,
            total_product: response.data?.product_cost?.total_product,
            isLoading: false,
          });
          setBestSeller({
            ...bestSeller,
            bestRows: response.data?.per_type,
          });
          setMissings(response.data?.missing_data);
          setCategories(null);
          setPerSKU(null);
        } else if (selectedPlatform === "stocking") {
          setSearchedPlatform("stocking");
          setCategoryVariationValues({
            variation_1_value: "color",
            variation_2_value: "style",
          });

          setQuantity(response.data?.product_cost?.total_product);
          setCalcCost({
            ...calcCost,
            total_cost: response.data?.product_cost?.total_cost,
            total_fabric: response.data?.product_cost?.total_fabric,
            total_product: response.data?.product_cost?.total_product,
            isLoading: false,
          });
          setBestSeller({
            ...bestSeller,
            bestRows: response.data?.per_color,
          });
          setMissings(response.data?.missing_data);
          setCategories(null);
          setPerSKU(null);
        } else if (selectedPlatform === "couch") {
          setSearchedPlatform("couch");
          setCategoryVariationValues({
            variation_1_value: "width",
            variation_2_value: "depth",
          });
          setQuantity(response.data?.product_cost?.total_product);
          setCalcCost({
            ...calcCost,
            total_cost: response.data?.product_cost?.total_cost,
            total_fabric: response.data?.product_cost?.total_fabric,
            total_product: response.data?.product_cost?.total_product,
            isLoading: false,
          });
          setBestSeller({
            ...bestSeller,
            bestRows: response.data?.per_type,
          });
          setMissings(response.data?.missing_data);
          setCategories(null);
          setPerSKU(null);
        } else if (selectedPlatform === "curtain") {
          setSearchedPlatform("curtain");
          setCategoryVariationValues({
            variation_1_value: process.env.REACT_APP_STORE_NAME === "Mina" ? "dimension" : "width",
            variation_2_value: process.env.REACT_APP_STORE_NAME === "Mina" ? "color" : "length",
          });
          setQuantity(response.data?.product_cost?.total_product);
          setCalcCost({
            ...calcCost,
            total_cost: response.data?.product_cost?.total_cost,
            total_fabric: response.data?.product_cost?.total_fabric,
            total_product: response.data?.product_cost?.total_product,
            isLoading: false,
          });
          setBestSeller({
            ...bestSeller,
            bestRows: response.data?.per_type.map(item => {
              return { ...item, sku: "Curtain" };
            }),
          });
          setMissings(response.data?.missing_data);
          setCategories(null);
          setPerSKU(null);
        } else if (selectedPlatform === "table") {
          setSearchedPlatform("table");
          setCategoryVariationValues({
            variation_1_value: "size",
            variation_2_value: "color",
          });
          setQuantity(response.data?.product_cost?.total_product);
          setCalcCost({
            ...calcCost,
            total_cost: response.data?.product_cost?.total_cost,
            total_fabric: response.data?.product_cost?.total_fabric,
            total_product: response.data?.product_cost?.total_product,
            isLoading: false,
          });
          setBestSeller({
            ...bestSeller,
            bestRows: response.data?.per_sku_size_color,
          });
          setMissings(response.data?.missing_data);
          setCategories(null);
          setPerSKU(null);
        } else if (selectedPlatform === "fabric") {
          setSearchedPlatform("fabric");
          setCategoryVariationValues({
            variation_1_value: "color",
            variation_2_value: null,
          });
          setQuantity(response.data?.product_cost?.total_product);
          setCalcCost({
            ...calcCost,
            total_cost: response.data?.product_cost?.total_cost,
            total_fabric: response.data?.product_cost?.total_fabric,
            total_product: response.data?.product_cost?.total_product,
            isLoading: false,
          });
          setBestSeller({
            ...bestSeller,
            bestRows: response.data?.per_sku_size_color,
          });
          setMissings(response.data?.missing_data);
          setCategories(null);
          setPerSKU(null);
        } else if (selectedPlatform === "pillow") {
          setSearchedPlatform("pillow");
          setCategoryVariationValues({
            variation_1_value: "size",
            variation_2_value: "color",
          });
          setQuantity(response.data?.product_cost?.total_product);
          setCalcCost({
            ...calcCost,
            total_cost: response.data?.product_cost?.total_cost,
            total_fabric: response.data?.product_cost?.total_fabric,
            total_product: response.data?.product_cost?.total_product,
            isLoading: false,
          });
          setBestSeller({
            ...bestSeller,
            bestRows: response.data?.per_sku_size_color,
          });
          setMissings(response.data?.missing_data);
          setCategories(null);
          setPerSKU(null);
        } else if (selectedPlatform === "all" || selectedPlatform === "sku") {
          setSearchedPlatform(selectedPlatform);
          setCategoryVariationValues({
            variation_1_value: "color",
            variation_2_value: "length",
          });
          setQuantity(response.data?.total_product);
          setCalcCost({
            ...calcCost,
            total_cost: response.data?.total_cost,
            total_fabric: response.data?.total_fabric,
            total_product: response.data?.total_product,
            isLoading: false,
          });
          setBestSeller({
            ...bestSeller,
            bestRows: response.data?.per_color,
          });
          setCategories(response.data.categories);
          setPerSKU(selectedPlatform === "sku" ? response.data.per_sku : null);
          setMissings({
            size_or_sku_error: [],
            fabric: [],
            unit_fabric: [],
            fabric_price: [],
            man_hour: [],
          });
        }
        // setQuantity(response.data?.TOTAL_COST?.total_count);
        // const { MISSING_TYPES, MISSING_SILVER_COSTS, MISSING_SILVER_QTY_COSTS, MISSING_14K_COSTS } =
        //   response.data;
        // setMissings({
        //   MISSING_14K_COSTS: MISSING_14K_COSTS?.count ? MISSING_14K_COSTS : null,
        //   MISSING_SILVER_QTY_COSTS: MISSING_SILVER_QTY_COSTS?.count
        //     ? MISSING_SILVER_QTY_COSTS
        //     : null,
        //   MISSING_TYPES: MISSING_TYPES?.count ? MISSING_TYPES : null,
        //   MISSING_SILVER_COSTS: MISSING_SILVER_COSTS?.count ? MISSING_SILVER_COSTS : null,
        // });
        // setPlatformsInfo(response.data?.PLATFORM_TOTAL_COST?.;
        // setBestSeller({
        //   ...bestSeller,
        //   bestRows: response.data?.PLATFORM_DETAIL?.
        //   isLoading: false,
        // });
        // setCalcCost({
        //   ...calcCost,
        //   total_cost: response.data?.TOTAL_COST?.total_cost,
        //   isLoading: false,
        //   repeat_count: response.data?.TOTAL_COST?.repeat_count ?? 0,
        // });
      })
      .catch(() => {
        // setPlatformsInfo({});
      });
  };

  useEffect(() => {
    endDateRef.current.value = moment().format("YYYY-MM-DD");
    beginnerDateRef.current.value = moment().subtract(1, "months").format("YYYY-MM-DD");
  }, []);

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

  const bestRows = bestSeller?.bestRows;

  const downloadExcel = () => {
    if (selectedPlatform === "all") {
      window.open(
        `${BASE_URL}cogs/monthly-usage-report/?months=${months.map(item => options.findIndex(o => o?.value === item?.value) + 1).join(",")}&year=${selectedYear?.getFullYear()}`,
        "_blank",
      );
    }
    else {

      window.open(
        `${BASE_URL}cogs/excel/?type=${selectedPlatform}&start_date=${beginnerDateRef.current.value}&end_date=${endDateRef.current.value}`,
        "_blank",
      );
    }
  };





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
              <PlatformButton label="Dress" id="dress" />
              <PlatformButton label="Approne" id="approne" />

              <PlatformButton label="Stocking" id="stocking" />

              {process.env.REACT_APP_STORE_NAME === "Linen Serisi" ? (
                <PlatformButton label="Couch" id="couch" />
              ) : null}

              <PlatformButton label="Curtain" id="curtain" />
              <PlatformButton label="Fabric" id="fabric" />

              {process.env.REACT_APP_STORE_NAME === "Linen Serisi" ? (
                <PlatformButton label="Pillow" id="pillow" />
              ) : null}

              {process.env.REACT_APP_STORE_NAME === "Linen Serisi" ? (
                <PlatformButton label="Table" id="table" />
              ) : null}

              <PlatformButton label="Sku" id="sku" />
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
                  disabled={calcCost.isLoading}
                >
                  <FormattedMessage id="calculateCost" defaultMessage="Calculate Cost" />
                </Button>

                <Button
                  variant="contained"
                  className={classes.btn}
                  color="primary"
                  disabled={
                    calcCost.isLoading || selectedPlatform === "sku" || (selectedPlatform === "all" && !months.length)
                  }
                  onClick={downloadExcel}
                >
                  Excell
                </Button>
              </div>
            </div>
            {selectedPlatform === "all" ? <div
              style={{
                display: mobileView ? "block" : "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                maxWidth: "620px"
              }}
            >
              <div className={classes.inputs} style={{ width: "100%" }}>

                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, width: "100%", justifyContent: "space-between" }}>
                  <Select
                    placeholder="Months"
                    isMulti
                    value={months}
                    onChange={(a) => {
                      setMonths(a)
                    }}
                    name="colors"
                    options={options}
                    className={classes.fullWidth}
                    classNamePrefix="select"
                  />
                  <DatePicker
                    value={selectedYear}
                    onChange={setSelectedYear}
                    format="YYYY"
                    type="year"
                    onlyYearPicker
                    style={{ width: "100px", height: "31px", textAlign: "center" }}
                  />
                </div>
              </div>


            </div> : null}
          </Paper>
        </div>
        {!perSKU &&
          quantity !== null &&
          (userRole === "admin" || user === "Umraniye" || user === "Muhasebe") ? (
          <CostGetter calcCost={calcCost} title={"Calculator"} />
        ) : null}
      </div>

      {!perSKU && (
        <div className={classes.missingTable}>
          {Object.entries(missings).map(([key, value], i) => {
            if (value.length) {
              return (
                <div className={classes.missingTable} key={i}>
                  <Card style={{ width: mobileView ? "90%" : 900 }}>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={2} style={{ textAlign: "center", background: "red" }}>
                            <h1 style={{ fontSize: 16, color: "white" }}>
                              <FormattedMessage id={key} defaultMessage={convertToTitleCase(key)} />{" "}
                              ({value.length})
                            </h1>
                          </TableCell>

                          <TableCell
                            scope="row"
                            style={{ wordBreak: "break-all", textAlign: "center" }}
                          >
                            {value.length ? (
                              value.map((id, j) => {
                                const _id = id.toString().split(" ")?.[0];

                                const links = {
                                  fabric: `order-details/${_id}`,
                                  fabric_price: `${process.env.REACT_APP_BASE_URL}admin/COGS/fabric/${_id}/change/`,
                                  man_hour: `${process.env.REACT_APP_BASE_URL
                                    }admin/COGS/${selectedPlatform.replace(
                                      "fabric",
                                      "meterial",
                                    )}/${_id}/change/`,
                                  size_or_sku_error: `order-details/${_id}`,
                                  sku_or_size_error: `order-details/${_id}`,
                                  unit_fabric: `${process.env.REACT_APP_BASE_URL
                                    }admin/COGS/${selectedPlatform.replace(
                                      "fabric",
                                      "meterial",
                                    )}/${_id}/change/`,
                                  color_code_error: `order-details/${_id}`,
                                  missing_color_code: `order-details/${_id}`,
                                  sku_or_wl_error: `order-details/${_id}`,
                                  width_or_depth_error: `order-details/${_id}`,
                                  width_or_length_error: `order-details/${_id}`,
                                };

                                return (
                                  <React.Fragment key={id}>
                                    <a
                                      href={links?.[key]}
                                      alt={id}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {id}
                                    </a>
                                    {j === value.length - 1 ? "" : ","}
                                  </React.Fragment>
                                );
                              })
                            ) : (
                              <FormattedMessage id={"noData"} defaultMessage={"No Data"} />
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Card>
                </div>
              );
            }
            return <div key={i}></div>;
          })}
        </div>
      )}

      {/* <div
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
                total_cost={item?.["total_cost"]}
                totalQty={item?.["total_count"]}
              />
            );
          })}
      </div> */}
      {/* 
      {selectedPlatform === "all" && bestSeller.bestRows && (
        <div className={classes.filterButtonsWrapper}>
          <Button
            variant="contained"
            checked={filteredPlatform === "dress"}
            disabled={calcCost.isLoading}
            onClick={e => setFilteredPlatform("dress")}
            style={{
              backgroundColor: filteredPlatform === "dress" ? "#3F51B5" : null,
              color: filteredPlatform === "dress" ? "white" : null,
            }}
          >
            <FormattedMessage id={"dress"} defaultMessage={"Dress"} />
          </Button>
        </div>
      )} */}
      {!perSKU && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            margin: "0 auto",
            width: "95%",
            gap: 20,
          }}
        >
          {categories &&
            Object.entries(categories).map(([key, value], i) => {
              return (
                <CostGetter
                  calcCost={{
                    total_cost: value?.total_cost,
                    total_fabric: value?.total_fabric,
                    total_product: value?.total_product,
                  }}
                  key={i}
                  title={convertToTitleCase(key)}
                />
              );
            })}
        </div>
      )}

      {!perSKU && (
        <div
          style={{
            marginBottom: "70px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {selectedPlatform === "all" && categories ? (
            <ApexChart
              data={Object.entries(categories).map(([key, value]) => {
                return { type: convertToTitleCase(key), count: value?.total_product };
              })}
            />
          ) : null}
          {bestRows && bestRows?.length ? (
            <SellerTable
              bestRows={bestRows}
              selectedPlatform={searchedPlatform}
              categoryVariationValues={categoryVariationValues}
            />
          ) : null}
          {bestRows?.length === 0 && (
            <Typography variant="h5" style={{ marginTop: 10 }}>
              <FormattedMessage id={"noBestSeller"} defaultMessage={"noBestSeller"} />
            </Typography>
          )}
        </div>
      )}

      {perSKU && (
        <>
          <div
            style={{
              marginBottom: "50px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <ApexChart
              data={perSKU.map(item => {
                return { type: item?.sku, count: item?.product_count };
              })}
            />
          </div>

          <div
            style={{
              marginBottom: "70px",
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
                      <FormattedMessage id="SKU" defaultMessage="SKU" />
                    </TableCell>

                    <TableCell className={classes.boldText} align="center">
                      <FormattedMessage id="Product Count" defaultMessage="Total Count" />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {perSKU?.map((item, skuIndex) => {
                    return (
                      <TableRow
                        className={skuIndex % 2 === 1 ? classes.darkTableRow : null}
                        key={skuIndex}
                      >
                        <TableCell align="center" className={classes.boldText}>
                          {item.sku}
                        </TableCell>

                        <TableCell align="center" className={classes.boldText}>
                          {item?.product_count}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default DateGetter;
