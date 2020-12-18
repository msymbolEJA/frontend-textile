import React from "react";

const emailValidator = () => {
  if (!values.email) {
    return (errors.email = "Fill the Email Address");
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    return (errors.email = "Invalid Email Address");
  }
};

export { Validator };
