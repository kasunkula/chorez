import React from 'react'

import Grid from '@material-ui/core/Grid';
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from '@material-ui/core/Container';

import AppBar from "./AppBar";
import TaskList from "./muiTaskList";

import {database} from './../FirebaseApp';
import Toolbar from "@material-ui/core/Toolbar";
import moment from "moment";

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
            currentUser: props.loggedInUser
        };
        this.handleActionOnChore = this.handleActionOnChore.bind(this);
    }

    componentDidMount() {
        // load user information
        database.ref('users').once('value', snapshot => {
            let users = {}
            snapshot.forEach((user) => {
                const userEmail = user.val().email
                users = {
                    ...users,
                    [user.key]: {
                       ...user.val()
                    }
                }
                if (userEmail === this.state.currentUser.email) {
                    if (user.val().avatar_url === this.state.currentUser.photoURL ||
                        user.val().display_name !== this.state.currentUser.displayName) {
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
            this.OnStateUpdate()
        });

        // load assignments
        database.ref('/assignments').once('value', (snapshot) => {
            let tmpAllAssignments = []
            snapshot.forEach((assignment) => {
                var tmpAssignment = {}
                tmpAssignment = {
                    uid: assignment.key,
                    ...assignment.val()
                }
                tmpAllAssignments.push(tmpAssignment)
            })

            this.setState((privState) => ({
                allAssignments: tmpAllAssignments.sort((a, b) => {
                    return a.date > b.date ? 1 : -1;
                }),
                assignmentsLoaded: true
            }))
            console.log("Assignments Load up Complete")
            this.OnStateUpdate()
        })

        // load tasks
        database.ref('/chores').once('value', (snapshot) => {
            let tmpAllTasks = {}
            snapshot.forEach((task) => {
                tmpAllTasks = {
                    ...tmpAllTasks,
                    [task.key]: {
                        uid: task.key,
                        pendingAssignments: [],
                        pastAssignments: [],
                        ...task.val()
                    }
                }
            })
            this.setState(() => ({
                allTasks: tmpAllTasks,
                TasksLoaded: true
            }))
            console.log("Tasks Load up Complete")
            this.OnStateUpdate()
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

    OnStateUpdate() {
        if (!this.state.usersLoaded || !this.state.TasksLoaded || !this.state.assignmentsLoaded) {
            return
        }

        let tmpTasks = {
            ...this.state.allTasks
        }

        Object.entries(tmpTasks).map(([uid, task]) => {
                task.pastAssignments = []
                task.pendingAssignments = []
            }
        )
        this.state.allAssignments.forEach((assignment) => {
            if (assignment.status != "Pending" || assignment.date < moment().format('YYYY/MM/DD') ) {
                tmpTasks[assignment.task_uid].pastAssignments.push(assignment)
            } else {
                tmpTasks[assignment.task_uid].pendingAssignments.push(assignment)
            }
        })

        this.setState(() => ({
            preProcessingComplete: true,
            allTasks: tmpTasks
        }))

        console.log(" === OnStateUpdate Processing Complete ===")
        // if (!localStorage.getItem("notification-token")){
        //     this.askForPushNotificationPermissions();
        // }
        //this.subscribeUser();
    }

    handleActionOnChore(uid, status) {
        let tmplAllAssigment = [...this.state.allAssignments]
        tmplAllAssigment.forEach((assignment) => {
            if (assignment.uid === uid) {
                assignment.status = status
                database.ref('assignments/' + assignment.uid).update(
                    {
                        status: status
                    }
                )
                console.log("assignment " + uid + " status updated to " + status)
            }
        })
        this.setState(() => ({
            allAssignments: tmplAllAssigment
        }))
        this.OnStateUpdate()
    }

    render() {
        return (
            <Container maxWidth="sm" direction="column" justify="center" alignItems="stretch" style={{height: "100vh"}}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <AppBar history={this.props.history} username={this.state.currentUser.displayName}
                                profilePicURL={this.state.currentUser.photoURL}/>
                    </Grid>
                </Grid>
                <Toolbar style={{marginBottom: "10px"}}/>
                {
                    !this.state.preProcessingComplete ? (
                        <Container style={{
                            height: "100vh", display: "flex",
                            justifyContent: "center", alignItems: "center"
                        }}>
                            <CircularProgress/>
                        </Container>
                    ) : (
                        <Grid container>
                            <Grid item xs={12}>
                                <TaskList
                                    handleActionOnChore={this.handleActionOnChore}
                                    users={this.state.allUsers}
                                    assignments={this.state.allAssignments}
                                    tasks={this.state.allTasks}
                                />
                            </Grid>
                        </Grid>
                    )
                }
            </Container>
        )
    }


}