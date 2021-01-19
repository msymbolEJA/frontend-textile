import { useState } from "react";
import Table from "./Table";
import Form from "./Form";
import DATA from "../../../helper/Data";

function NewOrder() {
  const [list, setList] = useState(DATA);
  const [info, setInfo] = useState({
    Name: "",
    Miles_per_Gallon: "",
    Cylinders: "",
    Displacement: "",
    Horsepower: "",
    Weight_in_lbs: "",
    Acceleration: "",
    Year: "",
    Origin: "",
  });

  //console.log(DATA);
 
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("HandleSubmit Button");
    let {
      Name,
      Miles_per_Gallon,
      Cylinders,
      Displacement,
      Horsepower,
      Weight_in_lbs,
      Acceleration,
      Year,
      Origin,
    } = info;
    Miles_per_Gallon = Number(Miles_per_Gallon);
    Cylinders = Number(Cylinders);
    Displacement = Number(Displacement);
    Horsepower = Number(Horsepower);
    Weight_in_lbs = Number(Weight_in_lbs);
    Acceleration = Number(Acceleration);

    setList([
      ...list,
      {
        id: new Date().getTime(),
        Name,
        Miles_per_Gallon,
        Cylinders,
        Displacement,
        Horsepower,
        Weight_in_lbs,
        Acceleration,
        Year,
        Origin,
      },
    ]);
    setInfo({
      Name: "",
      Miles_per_Gallon: "",
      Cylinders: "",
      length: "",
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
