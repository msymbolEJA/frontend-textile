import { useState } from "react";
import Table from "./Table";
import Form from "./Form";
import { postFormData } from "../../../helper/PostData";
import useFetch from "../../../helper/useFetch";
import { toastSuccessNotify } from "../../otheritems/ToastNotify";

const STORE_NAME = process.env.REACT_APP_STORE_NAME;
const BASE_URL = process.env.REACT_APP_BASE_URL;

const initialValue = {
  customer: "",
  supplier: STORE_NAME === "Linen Serisi" || process.env.REACT_APP_STORE_NAME === "Dallas" ? "umraniye" : "asya",
  type: "",
  length: "",
  color: "",
  qty: "",
  size: "",
  start: "",
  space: "",
  explanation: "",
};

function NewOrder() {
  const [list, setList] = useState("");
  const [info, setInfo] = useState(initialValue);
  const { response } = useFetch(`etsy/typleList/`);

  const handleSubmit = (e) => {
    e.preventDefault();

    postFormData(`${BASE_URL}etsy/manuel_orders/`, info)
      .then((data) => {
        // console.log(data.data.response);
        toastSuccessNotify(data.data.response);
      })
      .catch((error) => {
        console.log(error);
      });

    setList([
      ...list,
      {
        temp_id: new Date().getTime(),
        ...info,
      },
    ]);
    setInfo(initialValue);
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
        typeOptions={response?.results || []}
      />
      <Table list={list} />
    </div>
  );
}

export default NewOrder;
