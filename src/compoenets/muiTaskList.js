import React from 'react'
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Task from './muiTask'
import Grid from "@material-ui/core/Grid";

export default class TaskList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log(" === componentWillReceiveProps TaskList ===")
        this.setState({ ...nextProps });
    }

    render() {
        return (
            <div>
                {
                    Object.entries(this.state.tasks).map(([uid, task]) => {
                        return (
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Task
                                        key={task.uid}
                                        uid={task.uid}
                                        taskName={task.task_name}
                                        description={task.task_description}
                                        pastTasks={task.pastAssignments}
                                        pendingTasks={task.pendingAssignments}
                                        users={this.props.users}
                                        tasks={this.props.tasks}
                                        handleActionOnChore={this.props.handleActionOnChore}
                                    />
                                </Grid>
                            </Grid>
                        );
                    })
                }
            </div>
        )
    }
}