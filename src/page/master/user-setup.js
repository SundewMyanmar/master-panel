import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router";
import {connect} from 'react-redux';
import {primary,action,background} from '../../config/Theme';
import { withStyles, Paper,TextField, Icon, Button, FormControl, FormControlLabel, RadioGroup, Radio, FormHelperText, Grid, Divider, Typography, Chip, Select, MenuItem, Input, InputLabel, InputAdornment, IconButton } from '@material-ui/core';
import LoadingDialog from '../../component/Dialogs/LoadingDialog';
import ErrorDialog from '../../component/Dialogs/ErrorDialog';
import UserApi from '../../api/UserApi';
import FileApi from '../../api/FileApi';
import RoleApi from '../../api/RoleApi';
import FormatManager from '../../util/FormatManager';
import {USER_ACTIONS} from '../../redux/UserRedux';
import ImageUpload from '../../component/ImageUpload';

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
    select:{
        width:'100%',
        marginTop:32
    }
  });

  class UserSetupPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            userStatus:[
                {"display":"Active","key":"ACTIVE"},
                {"display":"Inactive","key":"PENDING"}
            ],
            status:"ACTIVE",
            roles:[],
            roleItems:[]
        };
    }

    componentDidMount(){
        console.log('did mount',this.props.match.params.id);
        this._loadRoles();
    }

    _loadRoles=async()=>{
        this.setState({showLoading:true});
        try{
            const response=await RoleApi.getAll();
            if(response.data && response.data.length>0){
                this.setState({
                    roleItems:response.data,
                    showLoading:false,
                    roles:[]
                },()=>{
                    if(this.props.match.params.id)
                        this._loadData();
                })
            }else{
                if(this.props.match.params.id)
                    this._loadData();
            }
        }catch(error){
            this.setState({showLoading:false,showError:true,errorMessage:"Please check your internet connection and try again!"});
        }
    }

    _loadData = async() =>{
        this.setState({showLoading:true});
        try{
            const data=await UserApi.getById(this.props.match.params.id);
            console.log('data',data);
            if(data){
                var image,preview;
                if(data.profile_image)
                    image=data.profile_image;
                if(data.profile_image && data.profile_image.public_url)
                    preview=data.profile_image.public_url;

                var roles=[];
                if(data.roles && data.roles.length>0){
                    for(var i=0;i<this.state.roleItems.length;i++){
                        for(var j=0;j<data.roles.length;j++){
                            if(this.state.roleItems[i].id===data.roles[j].id){
                                roles.push(this.state.roleItems[i]);
                                break;
                            }
                        }
                    }
                }

                this.setState({
                    id:data.id,
                    display_name:data.display_name,
                    user_name:data.user_name,
                    email:data.email,
                    status:data.status,
                    roles:roles,
                    password:"PWD123456",
                    showLoading:false,
                    image:image,
                    previewImage:preview
                });
            }
        }catch(error){
            this.setState({showLoading:false,showError:true,errorMessage:"Please check your internet connection and try again!"});
        }
    }

    validateForm(){
        var user_nameError=false;
        var emailError=false;
        var passwordError=false;
        var confirm_passwordError=false;
        var statusError=false;

        if(!this.props.match.params.id){
            if(!this.state.user_name || this.state.user_name===""){
                user_nameError=true;
            }
            
            if(!FormatManager.validateUser(this.state.user_name)){
                user_nameError=true;
            }

            if(!FormatManager.ValidateEmail(this.state.email)){
                emailError=true;
            }
            
            if(!this.state.password || this.state.password==="" || this.state.password.length<=6){
                passwordError=true;
            }

            if(this.state.password !==this.state.confirm_password){
                confirm_passwordError=true;
            }
        }

        if(!this.state.status) 
            statusError=true;

        this.setState({
            user_nameError:user_nameError,
            emailError:emailError,
            passwordError:passwordError,
            confirm_passwordError:confirm_passwordError,
            statusError:statusError
        });

        return !user_nameError && !emailError && !passwordError && !confirm_passwordError && !statusError ;
    }

    goBack(){
        this.props.history.push("/user/setup")
    }

    onSaveItem=async()=>{
        if(!this.validateForm()){
            console.log('validate fail')
            return;
        }

        this.setState({showLoading:true});
        var user={
            "display_name":this.state.display_name,
            "user_name":this.state.user_name,
            "email":this.state.email,
            "password":this.state.password,
            "status":this.state.status,
            "roles":this.state.roles
        }
        console.log(this.state.image);
        console.log(user);
        
        try{
        
            if(this.state.image && this.state.image.id){
                user.profile_image={
                    "id":this.state.image.id
                }
            }else if(this.state.image && !this.state.image.id){
                var fileResponse;
                
                fileResponse=await FileApi.upload(this.state.image);
                console.log(fileResponse);
                if(fileResponse)
                    user.profile_image={
                        "id":fileResponse.id
                    }
            }else{
                console.log('flo img null');
                user.profile_image=null;
            }
            
            if(this.props.match.params.id){
                user.id=this.state.id;
                const response = await UserApi.update(this.state.id, user);
                this.props.dispatch({
                    type: USER_ACTIONS.MODIFIED,
                    id: this.state.id,
                    user: response
                });
                this.props.match.params.id = null;
                this.props.history.push("/user/setup?callback=success");
            }else{
                const response = await UserApi.insert(user);
                console.log(response);
                this.props.dispatch({
                    type: USER_ACTIONS.CREATE_NEW,
                    user: response,
                });
                this.props.match.params.id = null;
                this.props.history.push("/user/setup?callback=success");
            }
        }catch(error){
            console.log(error);
            this.setState({ showLoading : false, showError : true, errorMessage : "Please check your internet connection and try again." });
        }
    }

    onChangeText = (key,value) => {
        this.setState({[key] : value});
    }

    handleError = () => {
        this.setState({ showError : false });
    }

    onImageChange(file,_this){
        var fr = new FileReader();
        fr.onload = function () {
            _this.setState({
                previewImage:fr.result,
                image:file
            }) 
        }
        fr.readAsDataURL(file);
    }

    onImageRemove(_this){
        _this.setState({
            previewImage:null,
            image:null
        });
    }

    render(){
        const { classes } = this.props;
        
        const handleRoleChange=event=>{
            this.setState({
                roles:event.target.value
            })
        };

        const handleChange = name => event => {
            console.log(event.target.value);
            this.setState({status:event.target.value});
        };
        return (
            <div>
                <LoadingDialog showLoading={this.state.showLoading} message="Loading please wait!" />
                <ErrorDialog showError={this.state.showError} title="Oops!" description={this.state.errorMessage} handleError={this.handleError} />
                <Paper className={classes.root} elevation={1}>
                    <Typography style={{textAlign: "center"}} color="primary" variant="h5" component="h3">
                        User Setup
                    </Typography>
                    <Divider className={classes.divider} light component="h3" />
                    <Grid className={classes.gridContainer} justify="center" container>
                        <Grid item xs={12} sm={12} md={8} lg={6}>
                            <form className={classes.form} autoComplete="off">
                                <Grid container justify="center">
                                    <ImageUpload onImageChange={this.onImageChange} onImageRemove={this.onImageRemove}
                                        previewImage={this.state.previewImage} _this={this}
                                    />
                                </Grid>
                                <Divider className={classes.divider} light component="h3" />
                                <Grid container spacing={8} alignItems="flex-start">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop:40 }} color={this.state.display_nameError?"error":"primary"}>person_outline</Icon>
                                    </Grid>
                                    <Grid item xs={11} sm={11} md={11} lg={11}>
                                        <TextField
                                            id="display_name"
                                            color="primary"
                                            label="Display Name*"
                                            error={this.state.display_nameError?true:false}
                                            fullWidth
                                            className={classes.textField}
                                            value={this.state.display_name?this.state.display_name:""}
                                            margin="normal"
                                            onChange={(event) => this.onChangeText(event.target.id, event.target.value)}
                                        />
                                        <div className={classes.form_error}>
                                            {this.state.nameError?"invalid display name field!":""}
                                        </div>
                                        
                                    </Grid>
                                </Grid>
                                <Grid container spacing={8} alignItems="flex-start">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop:40 }} color={this.state.user_nameError?"error":"primary"}>person</Icon>
                                    </Grid>
                                    <Grid item xs={11} sm={11} md={11} lg={11}>
                                        <TextField
                                            disabled={this.props.match.params.id?true:false}
                                            id="user_name"
                                            color="primary"
                                            label="User Name*"
                                            error={this.state.user_nameError?true:false}
                                            fullWidth
                                            className={classes.textField}
                                            value={this.state.user_name?this.state.user_name:""}
                                            margin="normal"
                                            onChange={(event) => this.onChangeText(event.target.id, event.target.value)}
                                        />
                                        <div className={classes.form_error}>
                                            {this.state.user_nameError?"invalid user name field!":""}
                                        </div>
                                        
                                    </Grid>
                                </Grid>
                                <Grid container spacing={8} alignItems="flex-start">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop:40 }} color={this.state.emailError?"error":"primary"}>email</Icon>
                                    </Grid>
                                    <Grid item xs={11} sm={11} md={11} lg={11}>
                                        <TextField
                                            disabled={this.props.match.params.id?true:false}
                                            id="email"
                                            color="primary"
                                            label="Email*"
                                            error={this.state.emailError?true:false}
                                            fullWidth
                                            className={classes.textField}
                                            value={this.state.email?this.state.email:""}
                                            margin="normal"
                                            onChange={(event) => this.onChangeText(event.target.id, event.target.value)}
                                        />
                                        <div className={classes.form_error}>
                                            {this.state.emailError?"invalid email field!":""}
                                        </div>
                                        
                                    </Grid>
                                </Grid>
                                {
                                    (this.props.match.params.id)?"":<div>
                                    <Grid container spacing={8} alignItems="flex-start">
                                        <Grid item>
                                            <Icon style={{ fontSize: 22, paddingTop:40 }} color={this.state.passwordError?"error":"primary"}>lock</Icon>
                                        </Grid>
                                        <Grid item xs={11} sm={11} md={11} lg={11}>
                                            <TextField
                                                id="password"
                                                color="primary"
                                                label="Password*"
                                                error={this.state.passwordError?true:false}
                                                fullWidth
                                                type="password"
                                                className={classes.textField}
                                                value={this.state.password?this.state.password:""}
                                                margin="normal"
                                                onChange={(event) => this.onChangeText(event.target.id, event.target.value)}
                                            />
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
                                            <TextField
                                                id="confirm_password"
                                                color="primary"
                                                label="confirm_password*"
                                                error={this.state.confirm_passwordError?true:false}
                                                fullWidth
                                                type="password"
                                                className={classes.textField}
                                                value={this.state.confirm_password?this.state.confirm_password:""}
                                                margin="normal"
                                                onChange={(event) => this.onChangeText(event.target.id, event.target.value)}
                                            />
                                            <div className={classes.form_error}>
                                                {this.state.confirm_passwordError?"password doesn't match!":""}
                                            </div>
                                            
                                        </Grid>
                                    </Grid></div>
                                }
                                
                                <Grid container spacing={8} alignItems="flex-start">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop:40 }} color="primary">whatshot</Icon>
                                    </Grid>
                                    <Grid item xs={11} sm={11} md={11} lg={11}>
                                        <Select
                                        multiple
                                        className={classes.select}
                                        value={this.state.roles}
                                        onChange={handleRoleChange}
                                        input={<Input id="select-multiple" />}
                                        MenuProps={{className: classes.menu}}
                                        >
                                        {this.state.roleItems.map(option => (
                                            <MenuItem key={option.id} value={option}>
                                            {option.name}
                                            </MenuItem>
                                        ))}
                                        </Select>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={8} alignItems="flex-start">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop:40 }} color="primary">code</Icon>
                                    </Grid>
                                    <Grid item xs={11} sm={11} md={11} lg={11}>
                                        <TextField
                                            id="status"
                                            color="primary"
                                            select
                                            fullWidth
                                            label="Select Status"
                                            className={classes.textField}
                                            value={this.state.status}
                                            onChange={handleChange()}
                                            SelectProps={{
                                            native: true,
                                            MenuProps: {
                                                className: classes.menu,
                                            },
                                            }}
                                            margin="normal">
                                            {this.state.userStatus.map(option => (
                                                <option key={option.key} value={option.key}>
                                                    {option.display}
                                                </option>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={8} alignItems="center" justify="space-evenly">
                                <Grid xs={12} sm={6} item md={5} lg={5}>
                                        <Button style={{marginTop: '30px', marginBottom: '20px', color: background.default}} color="primary" variant="contained" size="large" className={classes.button} onClick={() => this.onSaveItem()}>
                                            <Icon className={classes.iconButton} color="background">save</Icon>
                                            Save
                                        </Button>
                                    </Grid>
                                    <Grid xs={12} sm={6} item md={5} lg={5}>
                                        <Button style={{marginTop: '30px', marginBottom: '20px', color: primary.main}} variant="contained" size="large" className={classes.button} onClick={() => this.goBack()}>
                                            <Icon className={classes.iconButton} color="background">cancel_presentation</Icon>
                                            Cancel
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

UserSetupPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) =>{
    return{
        mes : state
    }
}

export default withRouter(connect(mapStateToProps)(withStyles(styles)(UserSetupPage)));
