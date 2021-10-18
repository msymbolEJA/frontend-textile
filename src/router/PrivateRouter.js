import React from "react";
import { Redirect, Route } from "react-router-dom";
//import { AppContext } from "../context/Context"

const localStoragePrefix = process.env.REACT_APP_STORE_NAME_ORJ + "-";
const PrivateRouter = ({ component: Component, ...rest }) => {
  //const { auth } = useContext(AppContext)

  return (
    <Route
      {...rest}
      render={(props) =>
        localStorage.getItem(localStoragePrefix + "x-auth-token") && true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRouter;

/*
render={props => (localStorage.getItem(localStoragePrefix + "x-auth-token") && auth) ?
*/
