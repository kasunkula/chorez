import React, { useContext } from 'react'
import { AuthContext } from '../Auth';
import TodoList from './TodoList';
import Nav from './Nav'
import {  Grid } from 'semantic-ui-react'
import { Tab } from 'semantic-ui-react'

function Dashboard({history}) {    
    const {currentUser} = useContext(AuthContext)
    console.log(currentUser)

    const panes = [
        { menuItem: 'My Chores', render: () => <TodoList /> },
        { menuItem: 'All Chores', render: () => <TodoList /> },
        { menuItem: 'Calender', render: () => <TodoList /> },
      ]

    return (
        <div>  
            <Grid style={{ maxWidth: 450, height: '100vh'}} textAlign='center' verticalAlign='middle'>
                <Grid.Row>
                    <Nav history={history} username={currentUser.displayName}  profilePicURL={currentUser.photoURL}/>     
                </Grid.Row>
            <Grid.Row>
                <Tab panes={panes} />
            </Grid.Row>
            </Grid>                              
        </div>
    )
}

export default Dashboard