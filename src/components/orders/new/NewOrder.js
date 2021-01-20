import { useState } from "react";
import Table from "./Table";
import Form from "./Form";

function NewOrder() {
  const [list, setList] = useState("");
  const [info, setInfo] = useState({
      temp_id:"",
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

  //console.log(DATA);
 
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("HandleSubmit Button");
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
    //Miles_per_Gallon = Number(Miles_per_Gallon);

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
      temp_id:"",
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
    <div className="App">
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
