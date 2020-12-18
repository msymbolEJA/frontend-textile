import { useState, useEffect } from "react";
import PhoneList from "./Table";
import InputForm from "./Form";

function NewOrder() {
  const [list, setList] = useState([]);
  const [info, setInfo] = useState({
    desert: "",
    calory: "",
    fat: "",
    carb: "",
    protein: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("HandleSubmit Button");
    const { desert, calory, fat, carb, protein } = info;
    setList([...list, { desert, calory, fat, carb, protein }]);
  };
  const handleChange = (e) => {
    // console.log(info);
    setInfo({ ...info, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    console.log("list", list);
  }, [list]);
  return (
    <div className="App">
      <InputForm handleSubmit={handleSubmit} handleChange={handleChange} />
      <PhoneList list={list} />
    </div>
  );
}

export default NewOrder;
