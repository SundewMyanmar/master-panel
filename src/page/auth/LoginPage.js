import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Icon, Button, IconButton, Divider, Grid, Typography, InputBase, Paper } from '@material-ui/core';
import { withRouter } from "react-router";
import {connect} from 'react-redux';
import uuid from 'uuid/v5';
import {primary,secondary,action,background,text} from '../../config/Theme';
import AuthApi from '../../api/AuthApi';
import MenuApi from '../../api/MenuApi';
import { MENU_ACTIONS } from '../../redux/MenuRedux';
import { STORAGE_KEYS,MAIN_MENU } from '../../config/Constant';
import LoadingDialog from '../../component/Dialogs/LoadingDialog';
import ErrorDialog from '../../component/Dialogs/ErrorDialog';
import { USER_ROLES } from '../../config/Constant';

const styles = theme => ({
    root: {
        backgroundColor:background.light,
        background:'linear-gradient(to bottom, #3b5998, 2%, #f6f7fa)',
        
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden'
    },
    container:{
        padding:5,
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
    },
    textField:{
        width: 'calc(100% - 8px)',
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
        marginLeft: theme.spacing.unit, 
    },
    cardBox:{
        backgroundImage:'url(/res/bg.png)',
        borderRadius:3,
        margin:'40px',
        boxShadow: '0 4px 8px 0 #a3b3c9',
        transition: '0.3s',
    },
    media: {
        width: 'calc(100%)',
        paddingTop: '20px',
        margin: 'auto',
        height: 140,
    },
    cardActions:{
        display: 'inline-block',
        width: '100%',
    },
    txtContainer:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        width: 'calc(100%)',
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
    margin: {
        margin: theme.spacing.unit,
    },
    inputContainer: {
        margin: '30px 0 0 0',
        padding: '2px 2px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    },
    input: {
        marginLeft: 8,
        flex: 1,
    },
    iconButton: {
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop:0,
        paddingBottom:0
    },
    divider: {
        backgroundColor: theme.palette.primary.main,
        width: 1,
        height: 28,
        margin: 4,
    },
    logo: {
        width: 120,
        height: 120,
        boxShadow: '0 2px 4px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)'
    },
    errorTxt: {
        color: action.warn,
        paddingLeft: '4px'
    },
    errorIcon: {
        color: action.warn,
        fontSize: '16px'
    },
    img: {
        width: '150px',
        height: '150px',
        borderRadius: '15px',
    }
});

class LoginPage extends React.Component{
    constructor(props){
        super(props);
        
        this.state={
            user: '',
            password: '',
            showLoading: false,
            showError: false,
            userError: false,
            passwordError: false,
            errorMessage: '',
        }
    }

    _loadMenuData = async() => {
        try {
            const menus = await MenuApi.getByRole();
            //Menu Permissions Here
            
            if (menus){
                const uniqueMenus = menus.data.reduce((unique, o) => {
                    if(!unique.some(obj => obj.id === o.id)) {
                        unique.push(o);
                    }
                    return unique;
                },[]);
                console.log(uniqueMenus);
                sessionStorage.setItem(MAIN_MENU.MENU, JSON.stringify(uniqueMenus));
                this.props.dispatch({
                    type: MENU_ACTIONS.BY_ROLE,
                    data: uniqueMenus
                })
            }
        } catch (error){
            this.setState({ showLoading : false });
        }
    }

    onChangeText = (key,value) =>{
        this.setState({[key] : value});
    }

    onLoginButtonClick = async() =>{
        if (this.validating()){
            return;
        }
        if (!window.navigator.onLine){
            this.setState({ errorMessage : "Please check your internet connection and try again." });
            this.handleError();
            return;
        }
        this.setState({showLoading: true});

        // const deviceId = uuid(this.state.user, uuid.URL) + ' ' + window.navigator.userAgent;
        const deviceId = uuid(this.state.user, uuid.URL);
        const userData = {
            user: this.state.user,
            password : this.state.password,
            device_id : deviceId,
            device_os : "WINDOW 7",
        }

        try {
            const data = await AuthApi.Authenticate(userData);
            if(data){
                sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(data));
                await this._loadMenuData();

                if(data.roles.map(t => t.id).indexOf(USER_ROLES.SUPER_USER) === -1 &&
                    data.roles.map(t => t.id).indexOf(USER_ROLES.ADMIN) === -1) {
                    this.setState({ showLoading : false, errorMessage : "You don't have permission to use Master API V4 Web Panel. Please contact to your admin." });
                    sessionStorage.clear();
                    this.handleError();
                }else{
                    this.props.history.push('/');
                }
            }
        } catch (error) {
            if (error){
                this.setState({ showLoading : false, errorMessage : "Request email or password is something worng." });
                this.handleError();
            } else {
                this.setState({showLoading: false, errorMessage: 'Please check your internet connection and try again.'});
                this.handleError();
            }
        }
    }

    handleClickShowPassword = () => {
        this.setState({ showPassword: !this.state.showPassword });
    };

    handleError = () => {
        this.setState({ showError: !this.state.showError});
    };

    handleKeyPress = (e) => {
        if (e.key === 'Enter'){
            this.onLoginButtonClick();
        }
    };

    validating = () => {
        if (this.state.user === '' || this.state.password === ''){
            if (this.state.user === ''){
                this.setState({ userError : true });
            } else {
                this.setState({ userError : false });
            }
            if (this.state.password === ''){
                this.setState({ passwordError : true });
            } else {
                this.setState({ passwordError : false });
            }
            return true;
        }
        this.setState({ userError : false, passwordError : false });
        return false;
    }

    render(){
        const {classes } = this.props;

        return(
            <div className={classes.root}>
                <ErrorDialog title="Oops!" description={this.state.errorMessage} showError={this.state.showError} handleError={this.handleError} />
                <LoadingDialog showLoading={this.state.showLoading} message="Please wait logging in!" />
                <Grid className={classes.container} container spacing={24} alignItems="center" justify="center">
                    <Grid style={{padding:'22px'}} className={classes.cardBox} item xs={12} sm={8} md={6} lg={4}>
                    <Grid container justify="center">
                        <img src="/res/logo.png" alt="Master API V4" title="Master API V4" className={classes.img} />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider style={{ margin: '20px 0'}} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography style={{ color: primary.main, textAlign: 'center', margin: '0px 0px 8px 0px'}} variant="h4">
                            Welcome!
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Paper className={classes.inputContainer} elevation={1}>
                            <Icon className={classes.iconButton} color="primary">mail</Icon>
                            <Divider className={classes.divider} />
                            <InputBase
                                autoFocus
                                name="user"
                                style={{color:text.main}}
                                className={classes.input} 
                                placeholder="user name or email"
                                onChange={(event) => this.onChangeText(event.target.name, event.target.value)}
                            />
                        </Paper>
                        {this.state.userError ? (
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '2px'}}>
                                <Icon className={classes.errorIcon}>warning</Icon>
                                <Typography className={classes.errorTxt} variant="caption">
                                    user name or email field is empty.
                                </Typography>
                            </div>
                        ) : (
                            <Typography variant="caption">
                            </Typography>
                        )}
                        <Paper className={classes.inputContainer} elevation={1}>
                            <Icon className={classes.iconButton} color="primary">lock</Icon>
                            <Divider className={classes.divider} />
                            <InputBase 
                                name="password"
                                style={{color:text.main}}
                                type={this.state.showPassword ? 'text' : 'password'}
                                className={classes.input} 
                                placeholder="password" 
                                onKeyPress={this.handleKeyPress}
                                onChange={(event) => this.onChangeText(event.target.name,event.target.value)}
                            />
                            <IconButton className={classes.iconButton} aria-label="password" onClick={this.handleClickShowPassword}>
                                {this.state.showPassword ? <Icon color="primary">visibility</Icon> : <Icon color="primary">visibility_off</Icon>}
                            </IconButton>
                        </Paper>
                        {this.state.passwordError ? (
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '2px'}}>
                                <Icon className={classes.errorIcon}>warning</Icon>
                                <Typography className={classes.errorTxt} variant="caption">
                                    password field is empty.
                                </Typography>
                            </div>
                        ) : (
                            <Typography variant="caption">
                            </Typography>
                        )}
                        <Button style={{marginTop: '30px', marginBottom: '20px', color: text.light}} color="primary" variant="contained" size="large" className={classes.button} onClick={() => this.onLoginButtonClick()}>
                            <Icon className={classes.iconButton} color="background">lock_open</Icon>
                            Login
                        </Button>
                        <Typography style={{ color: primary.main, textAlign: 'center', margin: '0px 0px 8px 0px'}} variant="h12">
                            Copyright © 2019 {new Date().getFullYear()<=2019?"":"-" + new Date().getFullYear()} by <a style={{color:primary.main}} target="_blank" href="http://www.sundewmyanmar.com/">Sundew Myanmar</a>. <br/>
                            All rights reserved.
                        </Typography>
                        
                    </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

LoginPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(connect()(withStyles(styles)(LoginPage)));