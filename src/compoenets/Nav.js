import React from 'react'
import { Icon } from 'semantic-ui-react'
import { firebaseApp } from '../FirebaseApp';
import { Image } from 'semantic-ui-react'
import './../styles/Components.css';

function Nav({history, username, profilePicURL}) {
    
    return (
        <div className="Nav">
            <Image src={profilePicURL} avatar />
            <Icon name='home' size='large' />
            <Icon name='sign-out' onClick={() => {
                    firebaseApp.auth().signOut();
                    history.push("/login")
                }}>
            </Icon>                   
        </div>
    )
}

export default Nav