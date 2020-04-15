import React from 'react'
import TodoList from './TodoList';
import Nav from './Nav'
import {  Grid } from 'semantic-ui-react'
import { Tab } from 'semantic-ui-react'
import { database } from './../FirebaseApp';

export default class Dashboard extends React.Component {    
    constructor(props) {
        super(props);
        this.state = {
            allUsers: {},
            currentUserChores: [],
            allChores: [],
            currentUser: props.loggedInUser                   
        };

        database.ref('users').once('value', snapshot => {
            var users = [] 
            snapshot.forEach((user) => {
                const userEmail = user.val().email                
                users = {...users, 
                    [userEmail]: {
                        "display_name": [user.val().display_name],
                        "avatar_url": [user.val().avatar_url]
                    }}            
                if (userEmail === this.state.currentUser.email) {
                    if (user.val().avatar_url === this.state.currentUser.photoURL || user.val().display_name !== this.state.currentUser.displayName) {
                        database.ref('users/' + user.key).update(
                            {                            
                                avatar_url: this.state.currentUser.photoURL,
                                display_name: this.state.currentUser.displayName
                            }
                        )
                        
                    }
                }
            })            
            this.setState(() => ({
                allUsers: users
            }))
          });

          database.ref('/assignments').once('value', (snapshot) => {     
            var userAssignments = [] 
            var allAssignements = []
            snapshot.forEach((assignment) => {                       
                if (assignment.val().assigned_user === this.state.currentUser.email) {
                    userAssignments.push(assignment.val())                    
                }
                allAssignements.push(assignment.val())
            })

            this.setState(() => ({
                currentUserChores: userAssignments.sort((a, b) => {
                    return a.date > b.date ? 1 : -1;
                }),
                allChores: allAssignements.sort((a, b) => {
                    return a.date > b.date ? 1 : -1;
                })
            }))
        })
    } 

    render () {
        const panes = [
            { menuItem: 'My Chores', render: () => <TodoList allUsers={this.state.allUsers} chores={this.state.currentUserChores} /> },
            { menuItem: 'All Chores', render: () => <TodoList allUsers={this.state.allUsers} chores={this.state.allChores} /> }
          ]

          return (
            <div>  
                <Grid style={{ maxWidth: 450, height: '100vh'}} textAlign="center" verticalAlign='top'>
                    <Grid.Row>
                        <Nav history={this.props.history} username={this.state.currentUser.displayName}  profilePicURL={this.state.currentUser.photoURL}/>     
                    </Grid.Row>
                <Grid.Row verticalAlign='top'>
                    <Tab panes={panes} />
                </Grid.Row>
                </Grid>                              
            </div>
        )
    }
    

    

    
}