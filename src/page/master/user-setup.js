import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router";
import {connect} from 'react-redux';
import { withStyles, Paper,TextField, Icon, Button, Grid, Divider, 
        Typography, Select, MenuItem, Input, FormControl, FormControlLabel, 
        FormLabel, InputLabel, Switch, Avatar, IconButton } from '@material-ui/core';

import {primary,action,background} from '../../config/Theme';
import LoadingDialog from '../../component/Dialogs/LoadingDialog';
import ErrorDialog from '../../component/Dialogs/ErrorDialog';
import TableDialog from '../../component/Dialogs/TableDialog';
import UserApi from '../../api/UserApi';
import RoleApi from '../../api/RoleApi';
import FileApi from '../../api/FileApi';
import {FILE_ACTIONS} from '../../redux/FileRedux';
import {USER_ACTIONS} from '../../redux/UserRedux';
import FormatManager from '../../util/FormatManager';
import ImageUpload from '../../component/ImageUpload';
import FileDialog from '../../component/Dialogs/FileDialog';

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
    },
    avatar: {
        margin: 10,
    },
  });

  class UserSetupPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            userStatus:[
                {"display":"Active","key":"ACTIVE"},
                {"display":"Inactive","key":"PENDING"}
            ],
            userGender:[
                {"display":"Male","key":"male"},
                {"display":"Female","key":"female"}
            ],
            status:"ACTIVE",
            checkBot: false,
            roles:[],
            roleItems:[],
            showLoading: false,
            showError: false,
            showTable: false,
            showFile: false,
            currentPage:0,
            pageSize:5,
            total:0,
            pageCount:1,
            fileCurrentPage:0,
            filePageSize:18,
            fileTotal:0,
            filePageCount:1, 
        };
    }

    componentDidMount(){
        this._loadRoles();
        
        this.paging();
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
                    user_name:data.user_name,
                    email:data.email,
                    status:data.status,
                    roles:roles,
                    password:"PWD123456",
                    showLoading:false,
                    image:image,
                    previewImage:preview,
                    bot:data.chat_bot_off ? data.chat_bot_off : false,
                });
                if (data.extras){
                    this.setState({
                        address : data.extras.address ? data.extras.address : "",
                        gender : data.extras.gender ? data.extras.gender : "",
                        phone : data.extras.phone ? data.extras.phone : "",
                    })
                }
                if (data.display_name){
                    this.setState({ display_name : data.display_name.uni ? data.display_name.uni : data.display_name })
                }
            }
        }catch(error){
            this.setState({showLoading:false,showError:true,errorMessage:"Please check your internet connection and try again!"});
        }
    }

    validateForm(){
        var user_nameError=false;
        var display_nameError=false;
        var emailError=false;
        var passwordError=false;
        var confirm_passwordError=false;
        var statusError=false;

        if(!this.props.match.params.id){
            if(!this.state.display_name || this.state.display_name===""){
                display_nameError=true;
            }

            if(!this.state.user_name || this.state.user_name===""){
                user_nameError=true;
            }
            
            if(!FormatManager.ValidateUser(this.state.user_name)){
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

        if(!this.state.display_name || this.state.display_name===""){
            display_nameError=true;
        }

        if(!this.state.status) 
            statusError=true;

        this.setState({
            display_nameError:display_nameError,
            user_nameError:user_nameError,
            emailError:emailError,
            passwordError:passwordError,
            confirm_passwordError:confirm_passwordError,
            statusError:statusError
        });

        return !display_nameError && !user_nameError && !emailError && !passwordError && !confirm_passwordError && !statusError ;
    }

    goBack(){
        this.props.history.push("/user/setup")
    }

    onSaveItem=async()=>{
        if(!this.validateForm()){
            return;
        }

        this.setState({showLoading:true});
        var user={
            "display_name":this.state.display_name,
            "user_name":this.state.user_name,
            "email":this.state.email,
            "password":this.state.password,
            "status":this.state.status,
            "chat_bot_off":this.state.bot,
            "extras": { 
                "address" : this.state.address,
                "phone" : this.state.phone,
                "gender" : this.state.gender,
            }
        }
        
        try{
            if(this.state.roles.length){
                var roles = [];
                for(const role of this.state.roles){
                    roles.push({ id : role.id })
                }
                user.roles = roles;
            }

            if(this.state.agent){
                user.agent={
                    "id":this.state.agent.id
                }
            }
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

    switchChange = () => {
        this.setState({ bot : !this.state.bot });
    }
    
    handleTableDialog = () => {
        this.setState({ showTable : !this.state.showTable });
    }
    
    onKeyDown=(e)=>{
        if(e.keyCode === 13){
            this.onSearch();
        }
    }

    onSearch(){
        this.setState({
            currentPage:0
        },()=>{
            this._loadAgents();
        })
    }

    filterTextChange=(key,value)=>{
        this.setState({
            searchFilter:value
        });
    }
    
    handleChangePage(e){
        console.log('handle change page',e);
    }

    handleChangeRowsPerPage(e,_this){
        _this.setState({
            pageSize:e.target.value
        },()=>{
            _this._loadAgents();
        })
    }

    pageChange=(pageParam,_this)=>{
        
        var currentPage=_this.state.currentPage;
        if(pageParam==="first"){
            currentPage=0;
        }else if(pageParam==="previous"){
            if(currentPage>0)
                currentPage-=1;
            else
                currentPage=_this.state.pageCount-1;
        }else if(pageParam==="forward"){
            if(currentPage===_this.state.pageCount-1)
                currentPage=0;
            else
                currentPage+=1;
        }else if(pageParam==="last"){
            currentPage=_this.state.pageCount-1;
        }

        _this.setState({
            currentPage:currentPage,
            showLoading:true
        },()=>{
            _this._loadAgents();            
        });
    }

    handleRowClick = (event, data) => {
        this.setState({ showTable : false, agent : data })
    }

    onUploadImage = async(event) => {
        try {
            var reader = new FileReader();
            var file = event.target.files[0];
            reader.readAsDataURL(file);
            if(file){
                var fileResponse = await FileApi.upload(file);
                if(fileResponse){
                    this.paging();
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    handleFileClick = (event, data) => {
        this.setState({ showFile : false, image : data, previewImage : data.public_url})
    }

    handleFileClose = () => {
        this.setState({ showFile : false })
    }

    handleFileOpen = (_this) => {
        this.setState({ showFile : true });
        _this.setState({ showDialog : false });
    }

    paging=async()=>{
        this.setState({showLoading: true});
        try{
            var result=await FileApi.getPaging(this.state.fileCurrentPage,this.state.filePageSize,"createdAt:DESC",this.state.fileSearchFilter);
            this.setState({ fileTotal : result.total, filePageCount : result.page_count, showLoading: false})

            if(result.count>0){
                this.props.dispatch({
                    type:FILE_ACTIONS.INIT_DATA,
                    data:result.data
                })
            }else{
                this.props.dispatch({
                    type:FILE_ACTIONS.INIT_DATA,
                    data:[]
                })

                this.setState({ showLoading: false, showError: true, errorMessage: 'There is no data to show.' });
            }
        }catch(error){
            this.props.dispatch({
                type:FILE_ACTIONS.INIT_DATA,
                data:[]
            })
        }
    }
    
    fileHandleChangePage(e){
        console.log('handle change page',e);
    }

    fileHandleChangeRowsPerPage(e,_this){
        _this.setState({
            filePageSize:e.target.value
        },()=>{
            _this.paging();
        })
    }

    filePageChange=(pageParam,_this)=>{
        var currentPage=_this.state.fileCurrentPage;
        if(pageParam==="first"){
            currentPage=0;
        }else if(pageParam==="previous"){
            if(currentPage>0)
                currentPage-=1;
            else
                currentPage=_this.state.filePageCount-1;
        }else if(pageParam==="forward"){
            if(currentPage===_this.state.filePageCount-1)
                currentPage=0;
            else
                currentPage+=1;
        }else if(pageParam==="last"){
            currentPage=_this.state.filePageCount-1;
        }

        _this.setState({
            fileCurrentPage:currentPage,
            showLoading:true
        },()=>{
            _this.paging();            
        });
    }
    
    fileKeyDown=(e)=>{
        if(e.keyCode === 13){
            this.fileSearch();
        }
    }

    fileSearch(){
        this.setState({
            fileCurrentPage:0
        },()=>{
            this.paging();
        })
    }

    filefilterTextChange=(key,value)=>{
        this.setState({
            fileSearchFilter:value
        });
    }

    render(){
        const { classes } = this.props;
        
        const handleRoleChange=event=>{
            this.setState({
                roles:event.target.value
            })
        };

        const handleGenderChange=event=>{
            this.setState({
                gender:event.target.value
            })
        };

        const handleChange = name => event => {
            this.setState({status:event.target.value});
        };

        const fields=[{
            name:"",
            align:"center",
            display_name:""
        },{
            name:"id",
            align:"center",
            display_name:"Id",
        },{
            name:"profile_image",
            align:"center",
            display_name:"Profile Image",
            type:"IMAGE"
        },{
            name:"name_en",
            align:"left",
            display_name:"Name",
        },{
            name:"order_available",
            align:"center",
            display_name:"Order Available",
        },{
            name:"active",
            align:"center",
            display_name:"Status",
        }];

        return (
            <div>
                <LoadingDialog showLoading={this.state.showLoading} message="Loading please wait!" />
                <ErrorDialog showError={this.state.showError} title="Oops!" description={this.state.errorMessage} handleError={this.handleError} />
                <FileDialog showFile={this.state.showFile}
                    items={this.props.masterpanel.file}
                    total={this.state.fileTotal} 
                    pageSize={this.state.filePageSize} 
                    currentPage={this.state.fileCurrentPage}
                    pageChange={this.filePageChange}
                    handleChangePage={this.fileHandleChangePage}
                    handleChangeRowsPerPage={this.fileHandleChangeRowsPerPage}
                    handleFileClick={this.handleFileClick}
                    handleClose={this.handleFileClose}
                    searchFilterText={this.state.fileSearchFilter ? this.state.fileSearchFilter : ""}
                    onSearch={this.fileSearch}
                    onKeyDown={this.fileKeyDown}
                    onChangeText={this.filefilterTextChange}
                    onUploadImage={this.onUploadImage}
                    _this={this}
                />
                <TableDialog tableTitle="Agent List" 
                    fields={fields}
                    items={this.props.masterpanel.agent?this.props.masterpanel.agent:[]}
                    onOpenDialog={this.state.showTable}
                    onCloseDialog={this.handleTableDialog}
                    isSelected={this.selected}
                    handleRowClick={this.handleRowClick}
                    searchText={this.state.searchFilter}
                    filterTextChange={this.filterTextChange}
                    onKeyDown={this.onKeyDown}
                    pageChange={this.pageChange}
                    total={this.state.total} 
                    pageSize={this.state.pageSize}
                    currentPage={this.state.currentPage}
                    handleChangePage={this.handleChangePage}
                    handleChangeRowsPerPage={this.handleChangeRowsPerPage}
                    _this={this}
                    multi={false}
                />
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
                                        previewImage={this.state.previewImage} _this={this} id="imageUpload"
                                        handleFileOpen={this.handleFileOpen}
                                    />
                                </Grid>
                                <Divider className={classes.divider} light component="h3" />

                                <Grid container spacing={8} style={{ paddingTop : 32}}>
                                    <Grid container item xs={12} sm={6} md={6} lg={6} justify="center" alignItems="center">
                                        <FormControl component="fieldset">
                                            <FormLabel component="legend">
                                                Agent
                                            </FormLabel>
                                            <FormControlLabel
                                                control={
                                                    this.state.agent ? (
                                                        <Avatar onClick={() => this.handleTableDialog()} alt="Agent Profile" src={this.state.agent.profile_image ? this.state.agent.profile_image.public_url : "./res/icon@256.png"} className={classes.avatar} />
                                                    ) : (
                                                        <IconButton color="primary" onClick={() => this.handleTableDialog()}>
                                                            <Icon>add_circle</Icon>
                                                        </IconButton>
                                                    )
                                                }
                                                label={this.state.agent ? this.state.agent.name_en : "Add Agent" }
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid container item xs={12} sm={6} md={6} lg={6} justify="center">
                                        <FormControl component="fieldset">
                                            <FormLabel component="legend">
                                                Chat Bot
                                            </FormLabel>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={!this.state.bot}
                                                        onChange={this.switchChange}
                                                        value="bot"
                                                        color="primary"
                                                    />
                                                }
                                                label={this.state.bot ? "Off" : "On"}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>

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
                                            {this.state.display_nameError?"invalid display name field!":""}
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
                                
                                <Grid container spacing={8} alignItems="flex-start">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop:40 }} color="primary">location_on</Icon>
                                    </Grid>
                                    <Grid item xs={11} sm={11} md={11} lg={11}>
                                        <TextField
                                            id="address"
                                            color="primary"
                                            label="Address"
                                            fullWidth
                                            className={classes.textField}
                                            value={this.state.address?this.state.address:""}
                                            margin="normal"
                                            onChange={(event) => this.onChangeText(event.target.id, event.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                                
                                <Grid container spacing={8} alignItems="flex-start">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop:40 }} color="primary">local_phone</Icon>
                                    </Grid>
                                    <Grid item xs={11} sm={11} md={11} lg={11}>
                                        <TextField
                                            id="phone"
                                            color="primary"
                                            label="Phone"
                                            fullWidth
                                            className={classes.textField}
                                            value={this.state.phone?this.state.phone:""}
                                            margin="normal"
                                            onChange={(event) => this.onChangeText(event.target.id, event.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                                
                                <Grid container spacing={8} alignItems="flex-end">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop:40 }} color="primary">wc</Icon>
                                    </Grid>
                                    <Grid item xs={11} sm={11} md={11} lg={11}>
                                        <FormControl fullWidth className={classes.formControl}>
                                            <InputLabel htmlFor="gender">Gender</InputLabel>
                                            <Select
                                                className={classes.select}
                                                value={this.state.gender ? this.state.gender : ""}
                                                onChange={handleGenderChange}
                                                input={<Input id="gender" />}
                                                MenuProps={{className: classes.menu}}
                                            >
                                            {this.state.userGender.map(option => (
                                                <MenuItem key={option.key} value={option.key}>
                                                    {option.display}
                                                </MenuItem>
                                            ))}
                                            </Select>
                                        </FormControl>
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
                                            <Icon className={classes.iconButton}>save</Icon>
                                            Save
                                        </Button>
                                    </Grid>
                                    <Grid xs={12} sm={6} item md={5} lg={5}>
                                        <Button style={{marginTop: '30px', marginBottom: '20px', color: primary.main}} variant="contained" size="large" className={classes.button} onClick={() => this.goBack()}>
                                            <Icon className={classes.iconButton}>cancel_presentation</Icon>
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
        masterpanel : state
    }
}

export default withRouter(connect(mapStateToProps)(withStyles(styles)(UserSetupPage)));
