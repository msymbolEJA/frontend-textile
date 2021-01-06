import React, { useState, createContext } from 'react'

export const AppContext = createContext()

export const ContextProvider = (props) => {
    const [user, setUser] = useState({
        username: "admin",
        email: "admin@admin.com"
    })
    return (
        <AppContext.Provider value={[user, setUser]}>
            {props.children}
        </AppContext.Provider>
    )
}


