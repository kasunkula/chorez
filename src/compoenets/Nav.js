import React from 'react'
import { Icon } from 'semantic-ui-react'
import { firebaseApp } from '../FirebaseApp';
import { Image } from 'semantic-ui-react'
import './../styles/Components.css';

function Nav({history, username, profilePicURL}) {
    
    return (
        <div className="Nav">
            <div style={{
                marginLeft: 10,
                marginBottom: 10
            }}>
                <Image size={"mini"} src={profilePicURL} avatar />
            </div>
            <div>
                <Icon name='home' size='large' />
            </div>
            <div style={{
                marginRight: 5
            }}>
                <Icon name='sign-out' size='large' onClick={() => {
                    firebaseApp.auth().signOut();
                    history.push("/login")
                }}>
                </Icon>
            </div>
        </div>
    )
}

export default Nav