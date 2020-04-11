import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LoginPage from './../compoenets/LoginPage'
import Dashboard from './../compoenets/Dashboard'
import { AuthProvider } from './../Auth'
import PrivateRoute from './PrivateRoute'
import { firebaseConfig } from './../FirebaseApp';
import firebase from "firebase/app";
import { FirebaseAuthProvider } from "@react-firebase/auth";

const AppRouter = () => (
    <FirebaseAuthProvider {...firebaseConfig} firebase={firebase}>
        <AuthProvider>
            <BrowserRouter>
                <div>                
                    <Switch>
                        <PrivateRoute exact path="/" component={Dashboard} />
                        <Route path="/login" component={LoginPage} />
                    </Switch>
                </div>
            </BrowserRouter>
        </AuthProvider>
    </FirebaseAuthProvider>
);

export default AppRouter;