import React from 'react'
import { Card, Grid, Header } from 'semantic-ui-react'
import TodoListItem from './TodoListItem'

export default class TodoList extends React.Component {      
    render () {
        return (
            <div className="Tab">
                <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='top'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' color='teal' textAlign='center'>
                            <Card.Group itemsPerRow='1'>
                                {
                                    this.props.chores.length === 0 ? (
                                        <p>No scheduled chores.!</p>
                                    ) : (
                                        this.props.chores.map((assignment) => {                                    
                                            return <TodoListItem 
                                            title={assignment.task_name} 
                                            subtitle={assignment.date} 
                                            description={assignment.task_description}
                                            dpUrl={this.props.allUsers[assignment.assigned_user].avatar_url}/>;
                                        })
                                    )
                                }
                            </Card.Group>
                        </Header>
                    </Grid.Column>
                </Grid>
            </div>
            )
    }
}