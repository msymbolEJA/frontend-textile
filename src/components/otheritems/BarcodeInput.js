import React from "react";
import BarcodeReader from "react-barcode-reader";

const BarcodeInput = ({ onError, onScan }) => {
  return (
    <div>
      <BarcodeReader onError={onError} onScan={onScan} />
    </div>
  );
};

export default BarcodeInput;
