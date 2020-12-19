import { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

const data = [
  {
    id: 1,
    desert: "Frozen yoghurt",
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    isEditMode: false,
  },
  {
    id: 2,
    desert: "Ice cream sandwich",
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    isEditMode: false,
  },
  {
    id: 3,
    desert: "Eclair",
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    isEditMode: false,
  },
  {
    id: 4,
    desert: "Baklava",
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    isEditMode: false,
  },
];

function NewOrder() {
  const [list, setList] = useState(data);
  const [info, setInfo] = useState({
    id: "",
    desert: "",
    calories: "",
    fat: "",
    carbs: "",
    protein: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("HandleSubmit Button");
    let { desert, calories, fat, carbs, protein } = info;
    calories = Number(calories);
    fat = Number(fat);
    carbs = Number(carbs);
    protein = Number(protein);
    setList([
      ...list,
      { id: new Date().getTime(), desert, calories, fat, carbs, protein },
    ]);
    setInfo({
      id: "",
      desert: "",
      calories: "",
      fat: "",
      carbs: "",
      protein: "",
    });
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
