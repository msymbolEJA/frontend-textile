import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { AppContext } from "../context/Context"

const PrivateRouter = ({ component: Component, ...rest }) => {
    const { auth } = useContext(AppContext)

    return (<Route
        {...rest}
        render={props => (localStorage.getItem("x-auth-token") && auth) ?
            (
                <Component {...props} />
            ) : (
                <Redirect to={{
                    pathname: "/",
                    state: { from: props.location }
                }} />
            )
        }
    />)
}

export default PrivateRouter
