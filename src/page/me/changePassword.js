import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router";
import {connect} from 'react-redux';
import {action,background} from '../../config/Theme';
import { withStyles, Paper, Icon, Button,FormControl, FormControlLabel, RadioGroup, Radio, FormHelperText, Grid, Divider, Typography, Chip, Select, MenuItem, Input, InputLabel, InputAdornment, IconButton } from '@material-ui/core';
import LoadingDialog from '../../component/Dialogs/LoadingDialog';
import ErrorDialog from '../../component/Dialogs/ErrorDialog';
import FileApi from '../../api/FileApi';
import ProfileApi from '../../api/ProfileApi';
import { STORAGE_KEYS} from '../../config/Constant';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        borderRadius: 0,
    },
    divider: {
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2,
    },
    inputContainer:{
        marginTop:18,
        marginLeft:0,
        width:'100%',
    },
    inputLabel:{
        paddingLeft:11
    },
    input: {
        marginLeft: 8,
        flex: 1,
    },
    button: {
        width: 'calc(100%)',
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
    iconButton: {
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop:0,
        paddingBottom:0
    },
    form_error:{
        color:action.error
    },
});

class ChangePasswordPage extends React.Component {
    constructor(props){
        super(props);
        this.state={
            
        };
    }

    componentDidMount(){
        var data=JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER));
        this.setState({
            user_name:data.user_name,
            id:data.id
        })
    }

    onSaveItem=async()=>{
        if(!this.state.display_name || this.state.display_name===""){
            this.setState({
                display_nameError:true
            })
            return;
        }

        var profile={
            "id":this.state.id,
            "display_name":this.state.display_name,
            "email":this.state.email,
            "roles":this.state.roles,
            "status":this.state.status,
            "user_name":this.state.user_name
        };

        try{
            if(this.state.image && this.state.image.id){
                profile.profile_image={
                    "id":this.state.image.id
                }
            }else if(this.state.image && !this.state.image.id){
                var fileResponse;
                
                fileResponse=await FileApi.upload(this.state.image);
                
                if(fileResponse)
                    profile.profile_image={
                        "id":fileResponse.id
                    }
            }else{
                profile.profile_image=null;
            }

            const response=await ProfileApi.updateProfile(profile);
            
            //update session storage
            var data=JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER));
            data.display_name=response.display_name;
            data.profile_image=response.profile_image;
            sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(data));

            this.setState({
                showSnack:true,
                snackMessage:"Save success.",
            })
        }catch(error){

        }
    }

    handleClickShowPassword=(key)=>{
        this.setState({
            [key]:!this.state[key]
        })
    }

    onChangeText = (key,value) => {
        this.setState({[key] : value});
    }

    validateForm(){
        var old_passwordError=false;
        var passwordError=false;
        var confirm_passwordError=false;

        if(!this.state.old_password || this.state.old_password==="" || this.state.old_password.length<=6){
            old_passwordError=true;
        }

        if(!this.state.password || this.state.password==="" || this.state.password.length<=6){
            passwordError=true;
        }

        if(this.state.password !==this.state.confirm_password){
            confirm_passwordError=true;
        }

        this.setState({
            old_passwordError:old_passwordError,
            passwordError:passwordError,
            confirm_passwordError:confirm_passwordError
        })

        return !old_passwordError && !passwordError &&!confirm_passwordError;
    }

    onSaveItem=async()=>{
        if(!this.validateForm()){
            return;
        }

        this.setState({showLoading:true});

        var data={
            "user":this.state.user_name,
            "old_password":this.state.old_password,
            "new_password":this.state.password
        }
        try{
            const response=await ProfileApi.changePassword(data);
            this.setState({
                showLoading : false,
                openGoto:true
            })
        }catch(error){
            console.error(error);
            this.setState({ showLoading : false, showError : true, errorMessage : error.data.content.message });
        }
    }

    gotoLogin(_this){
        _this.setState({
            openGoto:false
        });

        sessionStorage.clear();
        _this.props.history.push('/login');
    }

    handleError = () => {
        this.setState({ showError : false });
    }

    render(){
        const { classes } = this.props;

        return(
            <div>
                <Dialog
                    open={this.state.openGoto}
                    keepMounted
                    onClose={()=>this.gotoLogin(this)}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Change password success! Please login again to continue!
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={()=>this.gotoLogin(this)} color="primary">
                        Go to login
                    </Button>
                    </DialogActions>
                </Dialog>
                <LoadingDialog showLoading={this.state.showLoading} message="Loading please wait!" />
                <ErrorDialog showError={this.state.showError} title="Oops!" description={this.state.errorMessage} handleError={this.handleError} />
                <Paper className={classes.root} elevation={1}>
                    <Typography style={{textAlign: "center"}} color="primary" variant="h5" component="h3">
                        Change Password
                    </Typography>
                    <Divider className={classes.divider} light component="h3" />
                    <Grid className={classes.gridContainer} justify="center" container>
                        <Grid item xs={12} sm={12} md={8} lg={6}>
                            <form className={classes.form} autoComplete="off">    
                                <Grid container spacing={8} alignItems="flex-start">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop:40 }} color={this.state.old_passwordError?"error":"primary"}>lock</Icon>
                                    </Grid>
                                    <Grid item xs={11} sm={11} md={11} lg={11}>
                                        <FormControl className={classes.inputContainer}>
                                        <InputLabel className={classes.inputLabel} htmlFor="old_password">old password*</InputLabel>
                                        <Input
                                            id="old_password"
                                            color="primary"
                                            label="old Password*"
                                            error={this.state.old_passwordError?true:false}
                                            fullWidth
                                            type={this.state.showOldPassword ? 'text' : 'password'}
                                            className={classes.textField}
                                            value={this.state.old_password?this.state.old_password:""}
                                            margin="normal"
                                            onChange={(event) => this.onChangeText(event.target.id, event.target.value)}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton className={classes.iconButton} aria-label="password" onClick={()=>this.handleClickShowPassword('showOldPassword')}>
                                                        {this.state.showOldPassword ? <Icon color="primary">visibility</Icon> : <Icon color="primary">visibility_off</Icon>}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                        </FormControl>
                                        <div className={classes.form_error}>
                                            {this.state.old_passwordError?"invalid old password field!":""}
                                        </div>
                                        
                                    </Grid>
                                </Grid>                        
                                <Grid container spacing={8} alignItems="flex-start">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop:40 }} color={this.state.passwordError?"error":"primary"}>lock</Icon>
                                    </Grid>
                                    <Grid item xs={11} sm={11} md={11} lg={11}>
                                        <FormControl className={classes.inputContainer}>
                                        <InputLabel className={classes.inputLabel} htmlFor="password">password*</InputLabel>
                                        <Input
                                            id="password"
                                            color="primary"
                                            label="password*"
                                            error={this.state.passwordError?true:false}
                                            fullWidth
                                            type={this.state.showPassword ? 'text' : 'password'}
                                            className={classes.textField}
                                            value={this.state.password?this.state.password:""}
                                            margin="normal"
                                            onChange={(event) => this.onChangeText(event.target.id, event.target.value)}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton className={classes.iconButton} aria-label="password" onClick={()=>this.handleClickShowPassword('showPassword')}>
                                                        {this.state.showPassword ? <Icon color="primary">visibility</Icon> : <Icon color="primary">visibility_off</Icon>}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                        </FormControl>
                                        <div className={classes.form_error}>
                                            {this.state.passwordError?"invalid password field!":""}
                                        </div>
                                        
                                    </Grid>
                                </Grid>
                                <Grid container spacing={8} alignItems="flex-start">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop:40 }} color={this.state.confirm_passwordError?"error":"primary"}>lock</Icon>
                                    </Grid>
                                    <Grid item xs={11} sm={11} md={11} lg={11}>
                                        <FormControl className={classes.inputContainer}>
                                        <InputLabel className={classes.inputLabel} htmlFor="confirm_password">confirm password*</InputLabel>
                                        <Input
                                            id="confirm_password"
                                            color="primary"
                                            label="confirm password*"
                                            error={this.state.confirm_passwordError?true:false}
                                            fullWidth
                                            type={this.state.showConfirmPassword ? 'text' : 'password'}
                                            className={classes.textField}
                                            value={this.state.confirm_password?this.state.confirm_password:""}
                                            margin="normal"
                                            onChange={(event) => this.onChangeText(event.target.id, event.target.value)}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton className={classes.iconButton} aria-label="password" onClick={()=>this.handleClickShowPassword('showConfirmPassword')}>
                                                        {this.state.showConfirmPassword ? <Icon color="primary">visibility</Icon> : <Icon color="primary">visibility_off</Icon>}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                        </FormControl>
                                        <div className={classes.form_error}>
                                            {this.state.confirm_passwordError?"password doesn't match!":""}
                                        </div>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={8} alignItems="flex-start" justify="space-evenly">
                                    <Grid xs={12} sm={6} item md={5} lg={5}>
                                        <Button style={{marginTop: '30px', marginBottom: '20px', color: background.default}} color="primary" variant="contained" size="large" className={classes.button} onClick={() => this.onSaveItem()}>
                                            <Icon className={classes.iconButton} color="background">save</Icon>
                                            Save
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        );
    }
}

ChangePasswordPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) =>{
    return{
        masterpanel : state
    }
}

export default withRouter(connect(mapStateToProps)(withStyles(styles)(ChangePasswordPage)));
