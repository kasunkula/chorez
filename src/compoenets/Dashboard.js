import React, { useContext } from 'react'
import { AuthContext } from '../Auth';
import TodoList from './TodoList';
import Nav from './Nav'
import {  Grid } from 'semantic-ui-react'
import { Tab } from 'semantic-ui-react'
import { database } from './../FirebaseApp';

function Dashboard({history}) {    
    const {currentUser} = useContext(AuthContext)
    console.log(currentUser)

    database.ref('users').once('value').then(snapshot => {
        const userObjects = snapshot.val()
        console.log(userObjects)
       // Object.keys(userObjects).forEach((userId) => {
        snapshot.forEach((user) => {
            console.log(user.key)
            console.log(user.val().email)
            if (user.val().email === currentUser.email) {
                if (user.val().avatar_url === currentUser.photoURL || user.val().display_name !== currentUser.displayName) {
                    database.ref('users/' + user.key).update(
                        {                            
                            avatar_url: currentUser.photoURL,
                            display_name: currentUser.displayName
                        }
                    )
                    
                }
            }
        })

      });

    const panes = [
        { menuItem: 'My Chores', render: () => <TodoList user={currentUser} /> },
        { menuItem: 'All Chores', render: () => <TodoList usere=""/> }
      ]

    return (
        <div>  
            <Grid style={{ maxWidth: 450, height: '100vh'}} textAlign="center" verticalAlign='top'>
                <Grid.Row>
                    <Nav history={history} username={currentUser.displayName}  profilePicURL={currentUser.photoURL}/>     
                </Grid.Row>
            <Grid.Row verticalAlign='top'>
                <Tab panes={panes} />
            </Grid.Row>
            </Grid>                              
        </div>
    )
}

export default Dashboard