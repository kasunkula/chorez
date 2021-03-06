import React from 'react'
import TodoList from './TodoList';
import Nav from './Nav'
import {Grid, Loader, Tab} from 'semantic-ui-react'
import {database} from './../FirebaseApp';


export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            usersLoaded: false,
            TasksLoaded: false,
            assignmentsLoaded: false,
            preProcessingComplete: false,
            allUsers: {},
            allAssignments: [],
            allTasks: {},
            perTaskAssignments: {},
            currentUser: props.loggedInUser
        };
        this.handleActionOnChore = this.handleActionOnChore.bind(this);
    }

    componentDidMount() {
        // load user information
        database.ref('users').once('value', snapshot => {
            let users = []
            snapshot.forEach((user) => {
                const userEmail = user.val().email
                users = {
                    ...users,
                    [userEmail]: {
                        "display_name": [user.val().display_name],
                        "avatar_url": [user.val().avatar_url]
                    }
                }
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
                allUsers: users,
                usersLoaded: true
            }))
            console.log("User Load up Complete")
            this.onPostDataLoadup()
        });

        // load assignments
        database.ref('/assignments').once('value', (snapshot) => {
            var allAssignments = []
            snapshot.forEach((assignment) => {
                var assignedChore = {}
                assignedChore = {
                    uid: assignment.key,
                    ...assignment.val()
                }
                allAssignments.push(assignedChore)
            })

            this.setState((privState) => ({
                allAssignments: allAssignments.sort((a, b) => {
                    return a.date > b.date ? 1 : -1;
                }),
                assignmentsLoaded: true
            }))
            console.log("Assignments Load up Complete")
            this.onPostDataLoadup()
        })

        // load tasks
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
            console.log("Tasks Load up Complete")
            this.onPostDataLoadup()
        })
    }

    subscribeUser = () => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(function (reg) {

                reg.pushManager.subscribe({
                    userVisibleOnly: true
                }).then(function (sub) {
                    console.log('Endpoint URL: ', sub.endpoint);
                }).catch(function (e) {
                    if (Notification.permission === 'denied') {
                        console.warn('Permission for notifications was denied');
                    } else {
                        console.error('Unable to subscribe to push', e);
                    }
                });
            })
        }
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

    onPostDataLoadup() {
        if (!this.state.usersLoaded || !this.state.TasksLoaded || !this.state.assignmentsLoaded) {
            return
        }
        console.log("All info loaded")
        this.setState(() => ({
            preProcessingComplete: true
        }))



        // if (!localStorage.getItem("notification-token")){
        //     this.askForPushNotificationPermissions();
        // }
        //this.subscribeUser();
    }

    handleActionOnChore(uid, status) {
        let tmpAllAssignements = [...this.state.allAssignments]
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

    render() {
        const tabPanes = [
            {
                menuItem: 'Chores', render: () =>
                    <TodoList
                        displayOnly={true}
                        handleActionOnChore={this.handleActionOnChore}
                        users={this.state.allUsers}
                        assignments={this.state.allAssignments}
                        chores={this.state.allTasks}
                    />
            }
        ]

        return (
            <div>
                <Grid style={{maxWidth: 450, height: '100vh'}} textAlign="left" verticalAlign='top' columns={1}>
                    <Grid.Row>
                        <div className='NavOuterDiv'>
                            <Nav history={this.props.history} username={this.state.currentUser.displayName}
                                 profilePicURL={this.state.currentUser.photoURL}/>
                        </div>
                    </Grid.Row>
                    {
                        !this.state.preProcessingComplete ? (
                            <Loader size={"huge"} active inline='centered'/>
                        ) : (
                            <Grid.Row verticalAlign='top'>
                                <Tab panes={tabPanes}/>
                            </Grid.Row>
                        )
                    }
                </Grid>
            </div>
        )
    }


}