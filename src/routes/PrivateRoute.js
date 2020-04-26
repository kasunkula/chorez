import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from './../Auth'

const PrivateRoute = ({component:RouteComponent, ...rest}) => {
    const {currentUser} = useContext(AuthContext);
    console.log("Checking Current user at PrivateRoute : " + currentUser)
    return (
        <Route {...rest} render={
            routeProps => !!currentUser ? <RouteComponent loggedInUser={currentUser} {...routeProps}/> : <Redirect to={"/login"}/>
        }></Route>
    )
}

export default PrivateRoute