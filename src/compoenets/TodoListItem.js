import React from 'react'
import { Button, Card, Image } from 'semantic-ui-react'

function TodoListItem({title, subtitle, description, dpUrl}) {    
    const handleDone = () => {
        console.log("Task Completed!")
    }

    const handlReject = () => {
        console.log("Task Rejectd!")
    }


    return (
        <Card>
            <Card.Content>
            <Image
                floated='right'
                size='mini'
                src={dpUrl}
            />
            <Card.Header textAlign='left'>{title}</Card.Header>
            <Card.Meta textAlign='left'>{subtitle}</Card.Meta>
            <Card.Description textAlign='left'>
                {description}
            </Card.Description>
            </Card.Content>
            <Card.Content extra>
            <div className='ui two buttons'>
                <Button basic color='green' onClick={handleDone}>
                Done
                </Button>
                <Button basic color='red' onClick={handlReject}>
                Decline
                </Button>
            </div>
            </Card.Content>
        </Card>
    )
}

export default TodoListItem