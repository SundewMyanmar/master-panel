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
import MenuApi from '../../api/MenuApi';
import QuestionDialog from '../../component/Dialogs/QuestionDialog';
import LoadingDialog from '../../component/Dialogs/LoadingDialog';
import ErrorDialog from '../../component/Dialogs/ErrorDialog';
import Snackbar from '../../component/Snackbar';
import { MENU_ACTIONS } from '../../redux/MenuRedux';

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
    },
    iconButton: {
        padding: 10,
        color:theme.palette.primary.main
    },
});

class MenuPage extends React.Component {
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
        
        this.props.history.push('/menu/setup/detail');
    }

    edit(id,_this){
        _this.props.history.push('/menu/setup/detail/'+id);
    }

    delete(id,name,_this){
        _this.setState({
            itemName:name,
            itemToDelete:id,
            showQuestion:true
        })
    }

    handleQuestionDialog = (isDelete) => {
        if (isDelete){
            this.onDeleteItem(this.state.itemToDelete);
        }
        this.setState({ showQuestion: !this.state.showQuestion });
    };

    onDeleteItem = async(id) => {
        this.setState({ showLoading : true });
        try {
            await MenuApi.delete(id);
            this.props.dispatch({
                type: MENU_ACTIONS.REMOVE,
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
        
    }

    handleChangeRowsPerPage(e,_this){
        _this.setState({
            pageSize:e.target.value
        },()=>{
            _this.paging();
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

    paging=async()=>{
        this.setState({showLoading: true});
        try{
            var result=await MenuApi.getPaging(this.state.currentPage,this.state.pageSize,"id:ASC",this.state.searchFilter);
            this.setState({total:result.total,pageCount:result.page_count,showLoading:false})

            for(var i=0;i<result.data.length;i++){
                var role="";
                var menu="";
                if(result.data[i].roles){
                    for(var j=0;j<result.data[i].roles.length;j++){
                        if(role!=="")
                            role+=", "

                        role+=result.data[i].roles[j].name;
                    }
                }
                if(result.data[i].children){
                    for(var k=0;k<result.data[i].children.length;k++){
                        if(menu!=="")
                            menu+=", "

                        menu+=result.data[i].children[k].name;
                    }
                }
                result.data[i].role_data=role;
                result.data[i].child_menu=menu;
                result.data[i].is_divider= result.data[i].divider ? "True" : "False";
            }

            if(result.count>0){
                this.props.dispatch({
                    type:MENU_ACTIONS.INIT_DATA,
                    data:result.data
                })
            }else{
                this.props.dispatch({
                    type:MENU_ACTIONS.INIT_DATA,
                    data:[]
                })

                this.setState({ showLoading: false, showError: true, errorMessage: 'There is no data to show.' });
            }
        }catch(error){
            this.props.dispatch({
                type:MENU_ACTIONS.INIT_DATA,
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
            display_name:"Id",
        },{
            name:"name",
            align:"left",
            display_name:"Name",
        },{
            name:"icon",
            align:"left",
            display_name:"Icon",
        },{
            name:"state",
            align:"left",
            display_name:"State"
        },{
            name:"type",
            align:"left",
            display_name:"Type"
        },{
            name:"role_data",
            align:"left",
            display_name:"Roles",
        },{
            name:"child_menu",
            align:"left",
            display_name:"Child Menu"
        },{
            name:"is_divider",
            align:"center",
            display_name:"Divider"
        },{
            name:"",
            align:"center",
            display_name:"Action"
        }];
        
        return (
            <div>
                <LoadingDialog showLoading={this.state.showLoading} message="Loading please wait!" />
                <ErrorDialog showError={this.state.showError} title="Oops!" description={this.state.errorMessage} handleError={this.handleError} />
                <Snackbar vertical="top" horizontal="right" showSnack={this.state.showSnack} type="success" message={this.state.snackMessage} onCloseSnackbar={this.onCloseSnackbar} />
                <QuestionDialog itemName={this.state.itemName} 
                    showQuestion={this.state.showQuestion} 
                    handleQuestionDialog={this.handleQuestionDialog} 
                />
                <Paper className={classes.root}>
                    <div className={classes.searchHeader}>
                        <Grid container>
                            <Grid container item xs={4} direction="row" justify="flex-start" alignItems="center">
                                <Typography className={[classes.searchHeaderText,classes.searchPaper].join(" ")} style={{color: this.props.theme.palette.primary.main}} variant="h6" component="h1" noWrap>
                                    Menu List
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={classes.searchPaper}>
                                    <Grid container>
                                        <Grid item xs={10}>
                                            <InputBase onKeyDown={this.onKeyDown} className={classes.input} value={this.state.searchFilter?this.state.searchFilter:""}
                                             onChange={(event) => this.onChangeText(event.target.id, event.target.value)} placeholder="Search Menus.." />
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
                                    <Icon className={classes.searchIcon} >add</Icon>
                                    New
                                </Fab>
                            </Grid>
                        </Grid>
                    </div>
                    <MasterTable
                        items={this.props.masterpanel.menu?this.props.masterpanel.menu:[]} fields={fields} pageChange={this.pageChange}
                        total={this.state.total} pageSize={this.state.pageSize} currentPage={this.state.currentPage}
                        editButton={this.edit} deleteButton={this.delete}
                        handleChangePage={this.handleChangePage} handleChangeRowsPerPage={this.handleChangeRowsPerPage}
                        _this={this}
                    />
                </Paper>
            </div>
        );

    }
}

MenuPage.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const mapStateToProps = (state) =>{
    return{
        masterpanel : state
    }
}

export default withRouter(connect(mapStateToProps)(withStyles(styles,{ withTheme: true })(MenuPage)));