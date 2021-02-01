import React, { useState } from "react";
import BarcodeReader from "react-barcode-reader";
import TextField from "@material-ui/core/TextField";

const BarcodeInput = () => {
  const [result, setResult] = useState("No result");

  const handleScan = (data) => {
    setResult(data);
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div>
      <BarcodeReader onError={handleError} onScan={handleScan} />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <p style={{ marginRight: "1rem" }}>
          Barcode From Other Component : {result}
        </p>
        <TextField
          label="Barcode"
          id="outlined-size-small"
          defaultValue=""
          variant="outlined"
          size="small"
        />
      </div>
    </div>
  );
};

export default BarcodeInput;
