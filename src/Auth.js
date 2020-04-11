import React, {useEffect, useState} from 'react';
import { firebaseApp } from './FirebaseApp'

export const AuthContext = React.createContext();

export const AuthProvider = ( {children} ) => {
    const [currentUser, setCurrentuser] = useState(null);

    useEffect(() => {
        firebaseApp.auth().onAuthStateChanged(setCurrentuser)
    }, [])

    return (
        <AuthContext.Provider value = {{ currentUser }} >
            {children}
        </AuthContext.Provider>

    )
}