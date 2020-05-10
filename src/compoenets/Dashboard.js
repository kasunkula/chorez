import React from 'react'
import TodoList from './TodoList';
import Nav from './Nav'
import { Grid, Loader, Tab } from 'semantic-ui-react'
import { database } from './../FirebaseApp';

export default class Dashboard extends React.Component {    
    constructor(props) {
        super(props);
        this.state = {
            usersLoaded: false,
            TasksLoaded: false,
            assignementsLoaded: false,
            preProcessingComplete: false,
            allUsers: {},            
            allAssignments: [],
            allTasks: {},
            perTaskAssignments: {},
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
            this.setState((privState) => ({
                allUsers: users,
                usersLoaded: true
            }))
            this.buildPerTaskAssignements()
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

            this.setState((privState) => ({
                allAssignments: allAssignements.sort((a, b) => {
                    return a.date > b.date ? 1 : -1;
                }),
                assignementsLoaded: true
            }))
            this.buildPerTaskAssignements()
        })

        database.ref('/chores').once('value', (snapshot) => {     
            var Tasks = []
            snapshot.forEach((task) => {      
                var assignedWithID = {}   
                assignedWithID = {
                    uid: task.key,
                    ...task.val()
                }
                Tasks.push(assignedWithID)
            })
            this.setState((privState) => ({
                allTasks: Tasks,
                TasksLoaded: true
            }))
            this.buildPerTaskAssignements()
        })
    } 

    askForPushNotificationPermissions = async () => {
        try {
            if (Notification.permission === 'granted') {
                Notification.requestPermission((status) => {
                    console.log('Notification permission status:', status);
                });
            }
            
            console.log('Notification permission status:', Notification.permission);
            console.log('Registered service worker:', navigator.serviceWorker);
            if (Notification.permission === 'granted') {
                    navigator.serviceWorker.getRegistration().then((reg) => {
                    reg.showNotification('Hello world!');
                });
            }
            // const messaging = firebaseApp.messaging();
            // await messaging.requestPermission();
            // const token = await messaging.getToken();
            // console.log(token);
            // localStorage.setItem("notification-token", token)
            // return token
        } catch (error) {
            console.error(error)
        }
    }

    buildPerTaskAssignements() {
        if (!this.state.usersLoaded || !this.state.TasksLoaded || !this.state.assignementsLoaded) {
            return
        }
        this.setState((privState) => ({
            preProcessingComplete: true
        }))
        if (!localStorage.getItem("notification-token")){
            this.askForPushNotificationPermissions();
        }
    }

    handleActionOnChore(uid, status) {
        var tmpAllAssignements = [...this.state.allAssignments]
        tmpAllAssignements.forEach((assignment) => {
            if (assignment.uid === uid) {
                assignment.status = status
                database.ref('assignments/' + assignment.uid).update(
                    {                            
                        status: status
                    }
                )
                console.log("assignement " + uid + " status updated to " + status)
            }
        })
        this.setState(() => ({
            allAssignments: tmpAllAssignements
        }))
    }

    render () {
        const tabPanes = [
            { menuItem: 'My Tasks', render: () => 
                <TodoList 
                displayOnly={true} 
                handleActionOnChore={this.handleActionOnChore} 
                allUsers={this.state.allUsers} 
                allTasks={this.state.allTasks}
                chores={this.state.allAssignments.filter((assignment) => {
                    return assignment.assigned_user === this.state.currentUser.email
                })}
                /> }
          ]

          return (
            <div>  
                <Grid style={{ maxWidth: 450, height: '100vh'}} textAlign="left" verticalAlign='top' columns={1}>
                    <Grid.Row >
                    <div className='NavOuterDiv'>
                        <Nav history={this.props.history} username={this.state.currentUser.displayName}  profilePicURL={this.state.currentUser.photoURL}/>     
                    </div>                    
                    </Grid.Row>
                    {
                        !this.state.preProcessingComplete ? (
                            <Loader active inline='centered' />
                        ) : (
                            <Grid.Row verticalAlign='top'>
                                <Tab panes={tabPanes} />
                            </Grid.Row>
                        )
                    }                   
                </Grid>                              
            </div>
        )
    }
    

    

    
}