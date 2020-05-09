import React from 'react'
import { Button, Card, Image, Accordion, Divider, Icon, Table, Header } from 'semantic-ui-react'
import moment from 'moment';
import './../styles/Components.css';

export default class TodoListItem extends React.Component {    
    state = { activeIndex: -1 }
    
    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
        this.setState({ activeIndex: newIndex })
    }

    handleDone = () => {
        console.log("Task Completed!")
        this.props.handleActionOnChore(this.props.uid, "Completed")
    }

    handlReject = () => {
        console.log("Task Rejectd!")
        this.props.handleActionOnChore(this.props.uid, "Rejected")
    }

    renderButtons () {
        if (this.props.displayOnly) {
                if (this.props.status === "Pending"){
                    return <div>
                        <Divider hidden/>
                        <div className='ui two buttons'>                            
                                <Button basic color='green' onClick={this.handleDone}>
                                Done
                                </Button>
                                <Button basic color='red' onClick={this.handlReject}>
                                Decline
                                </Button>
                        </div>
                    </div>                
            }
        }
        return ""
    }

    renderCompletedTableItem (date, status, dp_url) {
        let statusIcon;
        if (status === 'Completed') {
            statusIcon = <Icon name='thumbs up' color='green' size='small' />
        } else {
            statusIcon = <Icon name='thumbs down' color='red' size='small' />
        }
        return (
            <Table.Row>
                <Table.Cell>
                    <Header as='h6' image>
                        <Image src={dp_url} rounded size='medium' />
                        <Header.Content>
                            {moment(date).format('dddd MMMM Do')}
                            <Header.Subheader>None</Header.Subheader>
                        </Header.Content>                        
                    </Header>
                </Table.Cell>
                <Table.Cell>
                    {statusIcon}
                </Table.Cell>
            </Table.Row>
        )
    }
    
    renderExtraContent () {
        const { activeIndex } = this.state        
        const completedTable = (
            <Table basic='very' celled collapsing singleLine='True' textAlign='left' verticalAlign='middle'>                
                <Table.Body>
                    {this.renderCompletedTableItem('2020/04/16', "Completed", "https://lh3.googleusercontent.com/a-/AOh14Gi3V3sFkItNTZOqWPmKMA9iUXcy0Tr58pJ6mzeI")}
                    {this.renderCompletedTableItem('2020/04/19', "Rejected", "https://lh6.googleusercontent.com/-O8n2HNKFA2o/AAAAAAAAAAI/AAAAAAAAAAA/AAKWJJNwq4puV0B8NI5MMoVllJTamIVBzQ/photo.jpg")}
                    {this.renderCompletedTableItem('2020/04/20', "Completed", "https://lh3.googleusercontent.com/a-/AOh14Ggf_EHLCjX2GLJTQHzButzPpm-3EwA_RYZvsFdkJA")}
                </Table.Body>
            </Table>
        )
        return (
            <Accordion styled>
                <Accordion.Title className="todoListCompletedAccorianTitle" content='Already Completed' index={0} onClick={this.handleClick}/>
                <Accordion.Content className='todoListCompletedAccorianTable' active={activeIndex === 0} content={completedTable} />            
            </Accordion>
        )

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
                <Card.Meta textAlign='left'>{"on " + moment(this.props.subtitle).format('dddd MMMM Do')}</Card.Meta>
                <Card.Description textAlign='left'>
                    {this.props.description}
                </Card.Description>                
                {this.renderButtons()}
                </Card.Content>
                <Card.Content extra>                     
                    {this.renderExtraContent()}
                </Card.Content>
            </Card>
        )
    }
}