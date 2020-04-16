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

        this.handleActionOnChore = this.handleActionOnChore.bind(this);

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
            var allAssignements = []
            snapshot.forEach((assignment) => {      
                var assignedChore = {}   
                assignedChore = {
                    uid: assignment.key,
                    ...assignment.val()
                }
                allAssignements.push(assignedChore)
            })

            this.setState(() => ({
                allChores: allAssignements.sort((a, b) => {
                    return a.date > b.date ? 1 : -1;
                })
            }))
        })
    } 

    handleActionOnChore(uid, status) {
        var allAssignements = [...this.state.allChores]
        allAssignements.forEach((assignment) => {
            if (assignment.uid === uid) {
                assignment.status = status
                database.ref('assignments/' + assignment.uid).update(
                    {                            
                        status: status
                    }
                )
                console.log("task " + uid + " status updated to " + status)
            }
        })
        this.setState(() => ({
            allChores: allAssignements
        }))
    }

    render () {
        const panes = [
            { menuItem: 'My Chores', render: () => 
                <TodoList 
                displayOnly={true} 
                handleActionOnChore={this.handleActionOnChore} 
                allUsers={this.state.allUsers} 
                chores={this.state.allChores.filter((assignment) => {
                    return assignment.assigned_user === this.state.currentUser.email
                })} 
                /> },
            { menuItem: 'All Chores', render: () => <TodoList displayOnly={false} allUsers={this.state.allUsers} chores={this.state.allChores} /> }
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