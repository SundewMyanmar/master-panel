import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router";
import {connect} from 'react-redux';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import InputBase from '@material-ui/core/InputBase';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import MasterTable from '../../component/MasterTable';
import UserApi from '../../api/UserApi';
import QuestionDialog from '../../component/Dialogs/QuestionDialog';
import LoadingDialog from '../../component/Dialogs/LoadingDialog';
import ErrorDialog from '../../component/Dialogs/ErrorDialog';
import Snackbar from '../../component/Snackbar';
import { USER_ACTIONS } from '../../redux/UserRedux';

const styles = theme => ({
    searchPaper:{
        marginLeft:16,
        marginTop:16,
        marginBottom:10,
        marginRight:5
    },
    searchHeader:{
        flex:1,
        // backgroundColor:theme.palette.primary.main,
        borderBottom:"1px solid #eff6f7"
    },
    searchHeaderText:{
        marginLeft:24
    },
    searchButton:{
        backgroundColor:theme.palette.background.default,
        color:theme.palette.primary.main,
        marginRight:5
    },
    searchIcon:{
        color: theme.palette.primary.main,
    },
    input: {
        flex:1,
        marginLeft: 12,
        marginTop:6,
        width:'100%',
        // color:theme.palette.primary.main
    },
    iconButton: {
        padding: 10,
        color:theme.palette.primary.main
    },
});

class UserPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currentPage:0,
            pageSize:10,
            total:0,
            showLoading: false,
            showQuestion: false,
            showSnack: false,
            snackMessage:"",
            showError: false,
            errorMessage: '',
            items:[],
            pageCount:1
        };
    }

    componentDidMount(){
        const query = new URLSearchParams(this.props.location.search);
        console.log("query", query);
        if(query.get('callback')==="success"){
            this.setState({
                showSnack:true,
                snackMessage:"Save success.",
            })
        }

        this._loadData();
    }

    addNew(){
        this.props.match.params.id = null;
        
        this.props.history.push('/user/setup/detail');
    }

    edit(id,_this){
        _this.props.history.push('/user/setup/detail/'+id);
    }

    delete(id,name,_this){
        _this.setState({
            itemName:name,
            itemToDelete:id,
            showQuestion:true
        })
    }

    handleQuestionDialog = (isDelete) => {
        console.log(isDelete);
        
        if (isDelete){
            this.onDeleteItem(this.state.itemToDelete);
        }
        this.setState({ showQuestion: !this.state.showQuestion });
    };

    onDeleteItem = async(id) => {
        this.setState({ showLoading : true });
        try {
            await UserApi.delete(id);
            this.props.dispatch({
                type: USER_ACTIONS.REMOVE,
                id: id,
            })
            this.setState({ showLoading: false, showSnack: true, snackMessage:"Delete success.", });
        } catch (error){
            this.setState({ showLoading : false, showError: true, errorMessage: 'Please try again. Something wrong!' });
        }
    }

    _loadData = () =>{
        this.paging();
    }
    
    handleChangePage(e){
        console.log('handle change page',e);
    }

    handleChangeRowsPerPage(e,_this){
        _this.setState({
            pageSize:e.target.value
        },()=>{
            _this.paging();
        })
    }

    pageChange=(pageParam,_this)=>{
        console.log(pageParam);
        console.log('cp',_this.state.currentPage,'ps',_this.state.pageSize,'t',_this.state.total);
        
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
            _this.paging();            
        });
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
            this.paging();
        })
    }

    onChangeText=(key,value)=>{
        this.setState({
            searchFilter:value
        });
    }

    handleCheckChange = async(data)=>{
        if (data){
            this.setState({showLoading:true});
            var user={
                "id":data.id,
                "display_name":data.display_name.uni ? data.display_name.uni : data.display_name,
                "user_name":data.user_name,
                "email":data.email,
                "password":"PWD123456",
                "status":data.status,
                "roles":data.roles,
                "chat_bot_off":data.chat_bot_off === "On" ? true : false,
                "facebook_id":data.facebook_id,
            }

            if(data.profile_image && data.profile_image.id){
                user.profile_image={
                    "id":data.profile_image.id
                }
            }else{
                user.profile_image=null;
            }
            if(data.extras){
                user.extras = { 
                    "address" : data.extras.address ? data.extras.address : null,
                    "gender" : data.extras.gender ? data.extras.gender : null,
                    "phone" : data.extras.phone ? data.extras.phone : null
                };
            }
            
            try{
                const response = await UserApi.update(data.id, user);
                this.props.dispatch({
                    type: USER_ACTIONS.MODIFIED,
                    id: this.state.id,
                    user: response
                });
                this.paging();

            }catch(error){
                this.setState({ showLoading : false, showError : true, errorMessage : "Please check your internet connection and try again." });
            }
        }
    }

    paging=async()=>{
        try{
            this.setState({showLoading: true})
            var result=await UserApi.getPaging(this.state.currentPage,this.state.pageSize,null,this.state.searchFilter);
            this.setState({total:result.total,pageCount:result.page_count,showLoading:false})

            for(var i=0;i<result.data.length;i++){
                var role="";
                if(result.data[i].roles){
                    for(var j=0;j<result.data[i].roles.length;j++){
                        if(role!=="")
                            role+=", "

                        role+=result.data[i].roles[j].name;
                    }
                }
                result.data[i].role_data=role;
            }

            for(const data of result.data){
                if(typeof data.display_name === "object"){
                    data.name = data.display_name.uni 
                } else {
                    data.name = data.display_name
                } 
                if(data.chat_bot_off === undefined || data.chat_bot_off === ""){
                   data.chat_bot_off = "Off";
                } else {
                    data.chat_bot_off = data.chat_bot_off ? "Off" : "On";
                }
            }

            if(result.count>0){
                this.props.dispatch({
                    type:USER_ACTIONS.INIT_DATA,
                    data:result.data
                })
            }else{
                this.props.dispatch({
                    type:USER_ACTIONS.INIT_DATA,
                    data:[]
                })

                this.setState({ showLoading: false, showError: true, errorMessage: 'There is no data to show.' });
            }
        }catch(error){
            this.props.dispatch({
                type:USER_ACTIONS.INIT_DATA,
                data:[]
            })
        }
    }

    handleError = () => {
        this.setState({ showError : false });
    }

    onCloseSnackbar = () => {
        this.setState({ showSnack: false });
    }

    render(){
        const { classes } = this.props;
        
        const fields=[{
            name:"id",
            align:"center",
            display_name:"ID"
        },{
            name:"chat_bot_off",
            align:"center",
            display_name:"Chat Bot",
            type:"CHECK"
        },{
            name:"profile_image",
            align:"center",
            display_name:"Image",
            type:"IMAGE"
        },{
            name:"role_data",
            align:"left",
            display_name:"Roles",
        },{
            name:"name",
            align:"left",
            display_name:"Name",
        },{
            name:"email",
            align:"left",
            display_name:"Email"
        },{
            name:"status",
            align:"left",
            display_name:"Status"
        },{
            name:"",
            align:"center",
            display_name:"Action"
        }];
        
        return (
            <div>
                <LoadingDialog showLoading={this.state.showLoading} message="Loading please wait!" />
                <ErrorDialog showError={this.state.showError} title="Oops!" description={this.state.errorMessage} handleError={this.handleError} />
                <Snackbar vertical="bottom" horizontal="right" showSnack={this.state.showSnack} type="success" message={this.state.snackMessage} onCloseSnackbar={this.onCloseSnackbar} />
                <QuestionDialog itemName={this.state.itemName} 
                    showQuestion={this.state.showQuestion} 
                    handleQuestionDialog={this.handleQuestionDialog} 
                />
                <Paper className={classes.root}>
                    <div className={classes.searchHeader}>
                        <Grid container>
                            <Grid container item xs={4} direction="row" justify="flex-start" alignItems="center">
                                <Typography className={[classes.searchHeaderText,classes.searchPaper].join(" ")} style={{color: this.props.theme.palette.primary.main}} variant="h6" component="h1" noWrap>
                                    User List
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={classes.searchPaper}>
                                    <Grid container>
                                        <Grid item xs={10}>
                                            <InputBase onKeyDown={this.onKeyDown} className={classes.input} value={this.state.searchFilter?this.state.searchFilter:""}
                                                onChange={(event) => this.onChangeText(event.target.id, event.target.value)} placeholder="Search Users.." 
                                            />
                                        </Grid>
                                        <Grid container item xs={2} justify="flex-end" alignItems="center">
                                            <IconButton className={classes.iconButton} aria-label="Menu" onClick={()=>this.onSearch()}>
                                                <Icon>search</Icon>
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                            
                            <Grid container item xs={4} direction="row" justify="flex-end" alignItems="center">
                                <Fab onClick={()=>this.addNew()} variant="extended" aria-label="Delete" className={[classes.searchPaper, classes.searchButton].join(" ")}>
                                    <Icon>add</Icon>
                                    New
                                </Fab>
                            </Grid>
                        </Grid>
                    </div>
                    <MasterTable
                        items={this.props.lunchbox.user?this.props.lunchbox.user:[]} fields={fields} pageChange={this.pageChange}
                        total={this.state.total} pageSize={this.state.pageSize} currentPage={this.state.currentPage}
                        editButton={this.edit} deleteButton={this.delete}
                        handleChangePage={this.handleChangePage} handleChangeRowsPerPage={this.handleChangeRowsPerPage}
                        _this={this}
                        handleCheckChange={this.handleCheckChange}
                    />
                </Paper>
            </div>
        );

    }
}

UserPage.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const mapStateToProps = (state) =>{
    return{
        lunchbox : state
    }
}

export default withRouter(connect(mapStateToProps)(withStyles(styles,{ withTheme: true })(UserPage)));
