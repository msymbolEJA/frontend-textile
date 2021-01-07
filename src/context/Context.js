import React, { useState, createContext } from 'react'

export const AppContext = createContext()

export const ContextProvider = (props) => {
    const [user, setUser] = useState({
        username: "admin",
        email: "admin@admin.com"
    })
    const [auth, setAuth] = useState(false)
    return (
        <AppContext.Provider value={{ user, setUser, auth, setAuth }}>
            {props.children}
        </AppContext.Provider>
    )
}


