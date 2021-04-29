import React, { useState, createContext } from "react";

export const AppContext = createContext();

export const ContextProvider = (props) => {
  const [user, setUser] = useState(localStorage.getItem("localUser"));
  const [auth, setAuth] = useState(false);
  const [lang, setLang] = useState(navigator.language.split(/[-_]/)[0]);

  const userRole = user?.role || localStorage.getItem("localRole");

  const isAdmin =
    userRole === "admin" ||
    userRole === "shop_manager" ||
    userRole === "shop_packer";
  // console.log("isAdmin", isAdmin);

  //console.log("userRole", userRole);

  return (
    <AppContext.Provider
      value={{ user, setUser, auth, setAuth, isAdmin, userRole, lang, setLang }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
