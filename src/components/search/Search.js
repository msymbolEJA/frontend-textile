import React, { useEffect, useState } from "react";
import Form from "./Form";
import ResultTable from "./resulttable/ResultTable";
import { queryData, globalSearch } from "../../helper/PostData";
import { getQueryParams } from "../../helper/getQueryParams";
import TextField from "@material-ui/core/TextField";
import { FormattedMessage, useIntl } from "react-intl";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Search = ({ location, history }) => {
  const [list, setList] = useState();
  const filters = getQueryParams();
  const { formatMessage } = useIntl();
  const [globalSearchKey, setGlobalSearchKey] = useState(
    location?.state?.global || ""
  );
  const [info, setInfo] = useState({
    id: "",
    status: "",
    buyer: "",
    sku: "",
    supplier: "",
    explanation: "",
    receipt: location?.state?.global || "",
    tracking_code: "",
  });

  const [fillError, setFillError] = useState();

  useEffect(() => {
    handleSubmit();
  }, [globalSearchKey]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (globalSearchKey) {
      if (globalSearchKey.length > 2) {
        // globalSearch(`${BASE_URL_MAPPING}?search=${globalSearchKey}`)
        globalSearch(
          `${BASE_URL}etsy/mapping_search/?receipt=${globalSearchKey.substring(
            0,
            10
          )}`
        )
          .then((response) => {
            //console.log(response.data);
            setList(response?.data?.results || []);
            setFillError();
          })
          .catch((error) => {
            console.log(error);
            setList([]);
            setFillError("Hata. Tekrar deneyiniz");
          });
      } else {
        setFillError("En az 3 karakter giriniz.");
      }
    } else {
      let queryString = "?";
      Object.keys(info).forEach((key) => {
        if (info[key]) {
          queryString = `${queryString}${key}=${info[key].substring(0, 10)}&`;
        }
      });
      if (queryString === "?") {
        setFillError("Please fill any field!");
      } else {
        setFillError();
        queryString = queryString.slice(0, -1);
        // let path = `${BASE_URL_MAPPING}${queryString}`;
        let path = `${BASE_URL}etsy/mapping_search/${queryString}`;
        queryData(path)
          .then((response) => {
            setList(response?.data?.results || []);
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
      <ResultTable list={list} refreshSearch={handleSubmit} />
    </div>
  );
};

export default Search;
