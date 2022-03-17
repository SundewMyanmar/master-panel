import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { useDispatch } from 'react-redux';
import { ALERT_REDUX_ACTIONS } from '../../util/AlertManager';
import { FLASH_REDUX_ACTIONS } from '../../util/FlashManager';
import {
    Typography,
    Container,
    Paper,
    Avatar,
    Icon,
    makeStyles,
    Grid,
    Button,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Checkbox,
    Collapse,
    List,
    Divider,
} from '@material-ui/core';
import SettingAccordion from '../../form/SettingAccordion';
import MasterForm from '../../fragment/MasterForm';
import SettingApi from '../../api/SettingApi';

const styles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        padding: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        padding: theme.spacing(3),
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
    },
    submit: {
        height: 55,
        marginTop: theme.spacing(1),
    },
    expansionPanel: {
        width: '100%',
    },
    listItem: {
        padding: theme.spacing(1),
    },
    route: {
        paddingLeft: theme.spacing(4),
    },
    method: {
        paddingLeft: theme.spacing(4) * 2,
    },
    icon: {
        marginRight: theme.spacing(1),
    },
    root:{
      width:'100%'
    }
}));

const SettingManager = () => {
    const classes = styles();
    const dispatch = useDispatch();
    const [expanded, setExpanded] = useState('');

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleError = (error) => {
        dispatch({
            type: ALERT_REDUX_ACTIONS.SHOW,
            alert: error || 'Please check your internet connection and try again.',
        });
    };

    const [structure,setStructure]=useState(async()=>{
      SettingApi.getStruct().then((result)=>{

        setStructure(result);
      }).catch(handleError);
      return [];
    })

    React.useEffect(()=>{
    },[structure])

    const handleSubmit = (data, name) => {
        dispatch({ type: ALERT_REDUX_ACTIONS.SHOW_LOADING });
        SettingApi.saveSetting(data, name)
            .then((savedData) => {
                dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
                dispatch({ type: FLASH_REDUX_ACTIONS.SHOW, flash: { type: 'success', message: 'Save successful.' } });
            })
            .catch(handleError);
    };

    return (
        <>
            <Container maxWidth="md">
              <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <Icon>settings</Icon>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Setting
                </Typography>
                <div className={classes.root}>
                  {structure && structure.length && structure.map((struct) => {
                      return (
                        <SettingAccordion key={`acc-${struct.fullName}`} setting={struct} data={struct.data} onSubmit={handleSubmit} onError={handleError} expanded={expanded} onAccordionChange={handleChange}/>
                      );
                  })}
              </div>
              </Paper>
            </Container>
        </>
    );
};

export default withRouter(SettingManager);
