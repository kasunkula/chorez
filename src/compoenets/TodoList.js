import React from 'react'
import { Card, Grid, Header } from 'semantic-ui-react'
import TodoListItem from './TodoListItem'

function TodoList() {     
return (
    <div className="Tab">
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='top'>
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='teal' textAlign='center'>
                    <Card.Group itemsPerRow='1'>
                        <TodoListItem title='Clean the Kitchen' subtitle='2020/04/11' description='Tidy and sweep the kitchen' />
                        <TodoListItem title='Empty garbage bin' subtitle='2020/04/12' description='Empty the kitchen garbage bin' />
                    </Card.Group>
                </Header>
            </Grid.Column>
        </Grid>
    </div>
    )
}

export default TodoList