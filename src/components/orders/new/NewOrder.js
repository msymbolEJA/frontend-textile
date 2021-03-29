import { useState } from "react";
import Table from "./Table";
import Form from "./Form";
import { postFormData } from "../../../helper/PostData";
const BASE_URL = process.env.REACT_APP_BASE_URL;

function NewOrder() {
  const [list, setList] = useState("");
  const [info, setInfo] = useState({
    customer: "",
    supplier: "",
    type: "",
    length: "",
    color: "",
    qty: "",
    size: "",
    start: "",
    space: "",
    explanation: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    let {
      customer,
      supplier,
      type,
      length,
      color,
      qty,
      size,
      start,
      space,
      explanation,
    } = info;

    postFormData(`${BASE_URL}etsy/manuel_orders/`, info)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });

    setList([
      ...list,
      {
        temp_id: new Date().getTime(),
        customer,
        supplier,
        type,
        length,
        color,
        qty,
        size,
        start,
        space,
        explanation,
      },
    ]);
    setInfo({
      temp_id: "",
      customer: "",
      supplier: "",
      type: "",
      length: "",
      color: "",
      qty: "",
      size: "",
      start: "",
      space: "",
      explanation: "",
    });
  };
  const handleChange = (e) => {
    // console.log(info);
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  return (
    <div className="App" style={{ marginTop: 40 }}>
      <Form
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        info={info}
      />
      <Table list={list} />
    </div>
  );
}

export default NewOrder;
