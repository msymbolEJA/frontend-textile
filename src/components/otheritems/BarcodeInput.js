import React, { useState } from "react";
import BarcodeReader from "react-barcode-reader";

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
      <p>Barcode From Other Component : {result}</p>
    </div>
  );
};

export default BarcodeInput;
