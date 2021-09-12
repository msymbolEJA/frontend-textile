import React, { useState, createContext } from "react";

export const AppContext = createContext();

const initialStore = localStorage.getItem("store") || "shop1";

export const ContextProvider = (props) => {
  const [user, setUser] = useState(localStorage.getItem("localUser"));
  const [auth, setAuth] = useState(false);
  const [lang, setLang] = useState(navigator.language.split(/[-_]/)[0]);
  const [store, setStore] = useState(initialStore);

  const userRole = user?.role || localStorage.getItem("localRole");

  const isAdmin =
    userRole === "admin" ||
    userRole === "shop_manager" ||
    userRole === "shop_packer";
  // console.log("isAdmin", isAdmin);

  //console.log("userRole", userRole);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        auth,
        setAuth,
        isAdmin,
        userRole,
        lang,
        setLang,
        store,
        setStore,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
