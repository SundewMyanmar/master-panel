import React from 'react';
import PropTypes from 'prop-types';
import { Divider,Icon } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Calendar from 'react-calendar';
import {connect} from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        borderRadius: 0,
    },
    flex: {
        flexGrow: 1,
        padding: theme.spacing.unit * 2,
    },
    divider:{
        marginBottom:5
    },
    card: {
    },
    media: {
        objectFit: 'cover',
    },
    map: {
        height: '250px',
        width: '100%',
        position: 'relative'
    },
    calendar:{
        width:'100%',
        border:'1px solid #eff6f7'
    },
    calendarTile:{
        height:80
    },
    list:{
        paddingTop:0,
        border:'1px solid #eff6f7',
        marginLeft:10,
        marginBottom:10,
    },
    listItem:{
        border:'1px solid #eff6f7',
    },
    listItemHeader:{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        borderBottom:'1px solid #eff6f7',
        backgroundColor:theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
  });

class DashboardPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            date:new Date(),
            showLoading:false,
            books:[],
            confirms:[],
            rejects:[]
        };
    }

    componentDidMount(){
        this._loadData();
    }

    _loadData = async() =>{
        
    }

    onChange = date => this.setState({ date },()=>{
        this._loadData();
    })

    handleListClick(type) {
        this.setState({
            [type]:!this.state[type]
        });
    }

    goto(url){
        console.log('goto',url);
        this.props.history.push(url);
    }

    render(){
        const { classes } = this.props;
        // const lat = this.state.location.split(",");

        return (
            <div>
                <Paper className={classes.root} elevation={1}>
                    <Typography style={{textAlign: "center"}} color="primary" variant="h5" component="h3">
                        Dashboard
                    </Typography>
                    <Divider className={classes.divider} light component="h3" />
                    
                </Paper>
            </div>
        );

    }
}

DashboardPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) =>{
    return{
        million : state
    }
}

export default withRouter(connect(mapStateToProps)(withStyles(styles)(DashboardPage)));