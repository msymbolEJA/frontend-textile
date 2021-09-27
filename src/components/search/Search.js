import React, { useState, useContext } from "react";
import Form from "./Form";
import ResultTable from "./resulttable/ResultTable";
import { queryData, globalSearch } from "../../helper/PostData";
import { AppContext } from "../../context/Context";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Search = () => {
  const [list, setList] = useState();
  const [info, setInfo] = useState({
    id: "",
    status: "",
    buyer: "",
    sku: "",
    supplier: "",
    explanation: "",
    receipt: "",
    tracking_code: "",
  });
  const [globalSearchKey, setGlobalSearchKey] = useState("");
  const [fillError, setFillError] = useState();
  const { store } = useContext(AppContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (globalSearchKey) {
      if (globalSearchKey.length > 2) {
        // globalSearch(`${BASE_URL_MAPPING}?search=${globalSearchKey}`)
        globalSearch(
          `${BASE_URL}${
            store === "shop1"
              ? "etsy/mapping_search/"
              : "shopify/mapping_search/"
          }?search=${globalSearchKey}`
        )
          .then((response) => {
            //console.log(response.data);
            setList(response.data);
            setFillError();
          })
          .catch((error) => {
            console.log(error);
            setList([]);
            setFillError("Something went wrong! Try again!");
          });
      } else {
        setFillError("Global search keywords should be min 3 letters.");
      }
    } else {
      let queryString = "?";
      Object.keys(info).forEach((key) => {
        if (info[key]) {
          queryString = `${queryString}${key}=${info[key]}&`;
        }
      });
      if (queryString === "?") {
        setFillError("Please fill any field!");
      } else {
        setFillError();
        queryString = queryString.slice(0, -1);
        // let path = `${BASE_URL_MAPPING}${queryString}`;
        let path = `${BASE_URL}${
          store === "shop1" ? "etsy/mapping_search/" : "shopify/mapping_search/"
        }${queryString}`;
        queryData(path)
          .then((response) => {
            setList(response.data);
          })
          .catch((error) => {
            console.log(error);
            setList([]);
          });
      }
    }
  };

  const clearBtn = () => {
    setInfo({
      id: "",
      status: "",
      buyer: "",
      sku: "",
      supplier: "",
      explanation: "",
      receipt: "",
      tracking_code: "",
    });
    setGlobalSearchKey("");
  };

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ marginTop: 20 }}>
      <Form
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        info={info}
        clearBtn={clearBtn}
        setGlobalSearchKey={setGlobalSearchKey}
        globalSearchKey={globalSearchKey}
        fillError={fillError}
      />
      <ResultTable list={list} />
    </div>
  );
};

export default Search;
