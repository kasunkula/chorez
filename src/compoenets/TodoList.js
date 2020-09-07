import React from 'react'
import {Card, Grid, Header} from 'semantic-ui-react'
import TodoListItem from './TodoListItem'
import muiTask from './muiTask'

export default class TodoList extends React.Component {
    render() {
        return (
            <div className="Tab">
                <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='top'>
                    <Grid.Column style={{maxWidth: 450}}>
                        <Header as='h2' color='teal' textAlign='center'>
                            <Card.Group itemsPerRow='1'>
                                {
                                    this.props.chores.map((task) => {
                                        return <muiTask
                                            key={task.uid}
                                            uid={task.uid}
                                            title={task.task_name}
                                            subtitle={"September 14, 2016"}
                                            description={task.task_description}
                                            // dpUrl={this.props.allUsers[assignment.assigned_user].avatar_url}
                                            // status={assignment.status}
                                            // handleActionOnChore={this.props.handleActionOnChore}
                                            // displayOnly={this.props.displayOnly}
                                        />;
                                    })
                                }
                            </Card.Group>
                        </Header>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}