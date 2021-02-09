import React, { useState } from "react";
import Form from "./Form";
import ResultTable from "./resulttable/ResultTable";
import { queryData, globalSearch } from "../../helper/PostData";

const Search = () => {
  const [fail, setFail] = useState(false);
  const [list, setList] = useState([
    {
      id: 1,
    },
  ]);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (globalSearchKey) {
      globalSearch(
        `http://144.202.67.136:8080/etsy/mapping/?search=${globalSearchKey}`
      )
        .then((response) => {
          //console.log(response.data);
          setList(response.data);
        })
        .catch((error) => {
          console.log(error);
          setList([]);
        });
    } else {
      let queryString = "/?";
      Object.keys(info).forEach((key) => {
        if (info[key]) {
          queryString = `${queryString}${key}=${info[key]}&`;
        }
      });
      if (queryString === "/?") {
        setFail(true);
      } else {
        setFail(false);
        queryString = queryString.slice(0, -1);
        let path = `http://144.202.67.136:8080/etsy/mapping${queryString}`;
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
    <div>
      <Form
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        info={info}
        fail={fail}
        clearBtn={clearBtn}
        setGlobalSearchKey={setGlobalSearchKey}
        globalSearchKey={globalSearchKey}
      />
      <ResultTable list={list} />
    </div>
  );
};

export default Search;
