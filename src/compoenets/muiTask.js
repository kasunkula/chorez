import React from 'react'
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CheckIcon from '@material-ui/icons/Check';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import moment from 'moment';
import './../styles/Components.css';
import red from "@material-ui/core/colors/red";
import Button from "@material-ui/core/Button";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import EmojiEmotionsOutlinedIcon from '@material-ui/icons/EmojiEmotionsOutlined';
import SentimentVeryDissatisfiedOutlinedIcon from '@material-ui/icons/SentimentVeryDissatisfiedOutlined';
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import green from "@material-ui/core/colors/green";

export default class Task extends React.Component {
    constructor(props) {
        super(props);
        console.log("Task props :", this.props)
        this.state = {
            expanded: false,
            nextAssigment: this.findNextPendingTask(this.props.pendingTasks)
        }
        this.handleDone = this.handleDone.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            nextAssigment: this.findNextPendingTask(nextProps.pendingTasks)
        });
        console.log(" === componentWillReceiveProps Task ===", this.state)
    }

    cardStyles = makeStyles((theme) => ({
        root: {
            width: "100%"
        },
        media: {
            height: 0,
            paddingTop: "56.25%" // 16:9
        },
        expand: {
            transform: "rotate(0deg)",
            marginLeft: "auto",
            transition: theme.transitions.create("transform", {
                duration: theme.transitions.duration.shortest
            })
        },
        expandOpen: {
            transform: "rotate(180deg)"
        },
        avatar: {
            backgroundColor: red[500]
        }
    }));

    listStyles = makeStyles((theme) => ({
        root: {
            width: '100%',
            maxWidth: '36ch',
            backgroundColor: theme.palette.background.paper,
        },
        inline: {
            display: 'inline',
        },
    }));

    handleExpandClick = () => {
        this.setState((prevState) => ({
            expanded: !prevState.expanded,
        }))
    };


    handleDone = () => {
        console.log("Task Completed!")
        this.props.handleActionOnChore(this.state.nextAssigment.uid, "Completed")
    }

    handleReject = () => {
        console.log("Task Rejected!")
        this.props.handleActionOnChore(this.props.uid, "Rejected")
    }

    getUser = (uid) => {
        return this.props.users[uid];
    }

    findNextPendingTask = (pendingTasks) => {
        return pendingTasks.sort((a, b) => a.date > b.date ? 1 : -1)[0]
    }

    toTitleCase = (str) => {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

    render() {
        return (
            <Card className={this.cardStyles.root}>
                <CardHeader
                    avatar={
                        <Avatar alt="Remy Sharp"
                                src={this.getUser(this.state.nextAssigment.assigned_user_uid).avatar_url}/>
                    }
                    action={
                        <IconButton aria-label="settings">
                            <MoreVertIcon/>
                        </IconButton>
                    }
                    title={this.props.taskName}
                    subheader={this.toTitleCase(this.getUser(this.state.nextAssigment.assigned_user_uid).display_name) +
                    " on " + moment(this.state.nextAssigment.date).format('dddd MMMM Do')}
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {this.props.description}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <Button
                        variant="contained"
                        color="secondary"
                        className={this.cardStyles.button}
                        startIcon={<CheckIcon/>}
                        onClick={this.handleDone}
                    >
                        Completed
                    </Button>
                    <IconButton
                        className={clsx(this.cardStyles.expand, {
                            [this.cardStyles.expandOpen]: this.state.expanded
                        })}
                        onClick={this.handleExpandClick}
                        aria-expanded={this.state.expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon/>
                    </IconButton>
                </CardActions>
                <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <List className={this.listStyles.root}>
                            {
                                this.props.pastTasks.sort((a, b) => a.date < b.date ? 1 : -1).slice(0, 10).map((assignment) => {
                                    return (
                                        <div>
                                            <ListItem alignItems="flex-start">
                                                <ListItemAvatar>
                                                    <Avatar alt="Remy Sharp"
                                                            src={this.getUser(assignment.assigned_user_uid).avatar_url}/>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={this.toTitleCase(this.getUser(assignment.assigned_user_uid).display_name)}
                                                    secondary={
                                                        <React.Fragment>
                                                            <Typography
                                                                component="span"
                                                                variant="body2"
                                                                className={this.listStyles.inline}
                                                                color="textPrimary"
                                                            >
                                                                {assignment.status == "Completed" ? "Completed" : "Overdue"}
                                                            </Typography>
                                                            {" — " + moment(assignment.date).format('dddd MMMM Do')}
                                                        </React.Fragment>
                                                    }
                                                />
                                                <ListItemSecondaryAction>
                                                    {
                                                        assignment.status == "Completed" ?
                                                            <EmojiEmotionsOutlinedIcon fontSize={"large"} style={{ color: green[500] }}/> :
                                                            <SentimentVeryDissatisfiedOutlinedIcon fontSize={"large"} style={{ color: red[500] }}/>
                                                    }
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                            <Divider variant="inset" component="li"/>
                                        </div>
                                    )
                                })
                            }

                        </List>
                    </CardContent>
                </Collapse>
            </Card>
        )
    }
}