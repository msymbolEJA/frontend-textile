import React, { useState, createContext } from "react";

export const AppContext = createContext();

export const ContextProvider = (props) => {
  const [user, setUser] = useState({
    user: "admin",
    email: "admin@admin.com",
    id: "",
    role: "",
  });
  const [auth, setAuth] = useState(false);
  const localUser = localStorage.getItem("localUser");
  //console.log(user.role);
  // console.log("localUser", localUser);
  // console.log("user.role", user.role);

  const isAdmin = (user.role || localUser) === "admin";
  console.log(isAdmin);
  return (
    <AppContext.Provider value={{ user, setUser, auth, setAuth, isAdmin }}>
      {props.children}
    </AppContext.Provider>
  );
};
