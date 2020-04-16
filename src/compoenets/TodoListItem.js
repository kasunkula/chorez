import React from 'react'
import { Button, Card, Image } from 'semantic-ui-react'

export default class TodoListItem extends React.Component {    
    handleDone = () => {
        console.log("Task Completed!")
        this.props.handleActionOnChore(this.props.uid, "Completed")
    }

    handlReject = () => {
        console.log("Task Rejectd!")
        this.props.handleActionOnChore(this.props.uid, "Rejected")
    }

    renderButtons (displayOnly, status) {
        if (displayOnly) {
            if (status === "Pending"){
                return <div className='ui two buttons'>
                            <Button basic color='green' onClick={this.handleDone}>
                            Done
                            </Button>
                            <Button basic color='red' onClick={this.handlReject}>
                            Decline
                            </Button>
                        </div>
            }
            else {
                return <Button basic color='grey' disabled={true}>
                            {this.props.status}
                        </Button>
            }
        }
        else {
            return ""
        }
    }
    
    render () {
        return (
            <Card>
                <Card.Content>
                <Image
                    floated='right'
                    size='mini'
                    src={this.props.dpUrl}
                />
                <Card.Header textAlign='left'>{this.props.title}</Card.Header>
                <Card.Meta textAlign='left'>{this.props.subtitle}</Card.Meta>
                <Card.Description textAlign='left'>
                    {this.props.description}
                </Card.Description>
                </Card.Content>
                <Card.Content extra> {this.renderButtons(this.props.displayOnly,this.props.status)} </Card.Content>
            </Card>
        )
    }
}