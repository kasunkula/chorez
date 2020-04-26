import React, { useCallback, useContext } from 'react';
import { firebaseApp } from './../FirebaseApp';
import * as firebase from 'firebase/app';
import { AuthContext } from '../Auth';
import { Redirect } from 'react-router';
import { Grid, Header, Icon, Button } from 'semantic-ui-react'

function LoginPage( {history} ) {
    const handleLogin = useCallback(
        async event => {
            try {
                await firebaseApp.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
                history.push("/")
            } catch (error) {
                alert(error)
            }
        }, 
        [history]
    )

    const {currentUser} = useContext(AuthContext)
    console.log("Checking Current user at login page : " + currentUser)
    if (currentUser) {      
        return <Redirect to="/" />
    }

    return (
        <div>
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='teal' textAlign='center'>
                    <Icon name='home' size='large' /> Log-in to your account
                </Header>
                <Button color='google plus' onClick={handleLogin}> 
                <Icon name='google' /> Sign In with Google
                </Button>
                </Grid.Column>
            </Grid>
        </div>
    )
}

export default LoginPage