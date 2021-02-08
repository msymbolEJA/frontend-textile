import React, { useState, createContext } from "react";

export const AppContext = createContext();

export const ContextProvider = (props) => {
  const [user, setUser] = useState({});
  const [auth, setAuth] = useState(false);
  const localUser = localStorage.getItem("localUser");
  //console.log(user.role);
  // console.log("localUser", localUser);
  // console.log("user.role", user.role);

  const userRole = user.role || localUser;

  const isAdmin =
    userRole === "admin" ||
    userRole === "shop_manager" ||
    userRole === "shop_packer";
  // console.log("isAdmin", isAdmin);

  //console.log("userRole", userRole);

  return (
    <AppContext.Provider
      value={{ user, setUser, auth, setAuth, isAdmin, userRole }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
