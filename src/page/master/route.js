
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router";
import {connect} from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import MasterTemplate from '../../component/MasterTemplate';
import { ROUTE_ACTIONS } from '../../redux/RouteRedux';
import RouteApi from '../../api/RouteApi';
import MasterTable from '../../component/MasterTable';
import MasterDrawer from '../../component/MasterDrawer';
import { Dialog, DialogTitle, DialogActions, Button } from '@material-ui/core';
import LoadingDialog from '../../component/LoadingDialog';
import ErrorDialog from '../../component/ErrorDialog';
import RoleApi from '../../api/RoleApi';
import { ROLE_ACTIONS } from '../../redux/RoleRedux';


const styles = theme => ({
    root: {
        borderRadius :0,
    },
    flex: {
        width: '100%',
    },
});

const fields = [
    {
        name: 'id',
        label: 'ID'
    },
    {
        name: 'http_method',
        label: 'HTTP METHOD',
    },
    {
        name: 'pattern',
        label: 'Route'
    },
    {
        name: 'roles',
        label: 'Roles',
        loadValue: (data) =>{
            const roles = data.roles.map((role, index) =>{
                return role.name + (index+1 === data.roles.length ? '' : ", ");
            })
            return roles;
        }
    },
]

class RoutePage extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            id: '',
            http_method: 0,
            route: '',
            role: [],
            open: false,
            filter: null,
            page: 0,
            rowsPerPage: 5,
            total: 0,
            deleteDialog: false,
            orderBy: "id",
            order: "desc",
            isLoading: true,
            isSaving: false,
            deleteErrorDialog: false,
        };
    }

    componentDidMount(){
        this._loadData();
        if(this.props.match.params.id){
            this.loadSelectedItem();
        }
    }

    componentDidUpdate(prevProps,prevState){
        if(this.props.match.params.id !== prevProps.match.params.id){
            if(this.props.match.params.id != null){
                this.loadSelectedItem();
            }else{
                this.setState({id:'', http_method: 0, route:'', role: []});
            }
        }
        if(this.state.page !== prevState.page || this.state.rowsPerPage !== prevState.rowsPerPage || this.state.orderBy !== prevState.orderBy || this.state.order !== prevState.order){
            this._loadData();
        }
    }

    loadSelectedItem = async() =>{
        const data = await RouteApi.getById(this.props.match.params.id);
        const roles = data.roles.map(role => role.id);
        this.setState({id:data.id, http_method: data.http_method, role: roles, route: data.pattern });
    }

    _loadData = async() =>{
        const data = await RouteApi.getAll(this.state.filter,this.state.page,this.state.rowsPerPage,this.state.orderBy,this.state.order);
        this.setState({total: data.total});
        this.props.dispatch({
            type: ROUTE_ACTIONS.INIT_DATA,
            data: data.data
        })
        const role = await RoleApi.getAll();
        if (role){
            this.props.dispatch({
                type: ROLE_ACTIONS.INIT_DATA,
                data: role.data
            })
        }
        this.setState({isLoading : false});
    }

    onKeyPress = (key) =>{
        if(key === 'Enter'){
            this._loadData();
        }
    }

    handleChangePage = (page) => {
        this.setState({ page, isLoading: true });
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({ rowsPerPage: event.target.value, isLoading: true});
    };

     addNewButton = () =>{
        this.props.match.params.id = null;
        this.props.history.push("/routes");
        this.setState({open : true});
    }

    handleRowClick = (data) => {
        this.setState({open: true});
        this.props.history.push('/routes/' + data.id);
    }
     
    handleClose = () => {
        this.setState({ open: false });
        this.setState({ nameError : false, codeError : false});
    }

    handleDeleteDialogOpen = (data) =>{
        this.setState({deleteDialog: true, deleteItemName: data.name, deleteItemId: data.id});
    }

    handleWarningClose = () =>{
        this.setState({deleteDialog: false});
    }

    handleDelete = async(id) =>{
       try{
            await RouteApi.delete(id);
            this.props.dispatch({
            type: ROUTE_ACTIONS.REMOVE,
            id: id,
        })
        this.setState({deleteDialog: false});
        }catch(error){
            if(error && error.data.content.message.includes("a foreign key constraint fails")){
                this.setState({deleteErrorDialog: true})
            }
        }
        this.setState({deleteDialog: false}); 
    }

    deleteError = () =>{
        return(
            <ErrorDialog showError={this.state.deleteErrorDialog} title="Delete Error" description="Cannot delete in-use item" handleError={this.deleteErrorDialogClose}/>
        );
    }

    deleteErrorDialogClose = () =>{
        this.setState({deleteErrorDialog: !this.state.deleteErrorDialog});
    }

    validating = () => {
        if (this.state.http_method === 0 || this.state.route === '' || this.state.role.length === 0 ) {
            this.state.http_method === 0 ? this.setState({ httpMethodError : true }) : this.setState({ httpMethodError : false });
            this.state.route === '' ? this.setState({ routeError : true }) : this.setState({ routeError : false });
            this.state.role.length === 0 ? this.setState({ roleError : true }) : this.setState({ roleError : false });
            return true;
        }
        this.setState({ httpMethodError : false, routeError : false, roleError : false});
        return false;
    }

    onSaveItem = async() =>{
        if (this.validating()){
            return;
        }
        this.setState({isSaving: true});

        const roles = this.state.role.map(role => this.props.lunchbox.role.find(row => row.id === role));
        const route ={
            http_method: this.state.http_method,
            pattern: this.state.route,
            roles: roles,
        };
        if(this.props.match.params.id){
            route.id = this.state.id;
            const response = await RouteApi.update(this.state.id,route);
            this.props.dispatch({
                type: ROUTE_ACTIONS.MODIFIED,
                id: this.state.id,
                route: response
            })
            this.setState({isSaving: false});
        }else{
            const response = await RouteApi.insert(route);
            this.props.dispatch({
                type: ROUTE_ACTIONS.CREATE_NEW,
                route: response,
            })
            this.setState({isSaving: false});
        }
        this.props.match.params.id = null;
        this.props.history.push("/routes");
        this.setState({open: false});
    }

    onChangeText = (key,value) => {
        this.setState({[key] : value});
    }

    render(){
        const { classes } = this.props;
        const buttonList = [
            {
                label: 'Add',
                icon: 'add_box',
                type: "IconButton",
                onClick: this.addNewButton,
            },
        ];
        const DrawerList = [
            {
                type: "combo",
                label: 'Http Method',
                name: 'http_method',
                menuTitle: "Select Method",
                isRequired: true,
                hasError: this.state.httpMethodError,
                value: this.state.http_method, 
                onChange: this.onChangeText,
                comboItem: {
                    value: 'id',
                    label: 'name',
                    data: [
                        {id: 'GET', name: 'GET'},
                        {id: 'POST', name: 'POST'},
                        {id: 'PUT', name: 'PUT'},
                        {id: 'DELETE', name: 'DELETE'},
                    ]
                }
            },
            {
                type: "textField",
                label: 'Route',
                name: 'route',
                isRequired: true,
                hasError: this.state.routeError,
                value: this.state.route, 
                onChange: this.onChangeText,
            },
            {
                type: "multiComboSelect",
                label: "Role",
                name: 'role',
                isRequired: true,
                hasError: this.state.roleError,
                value: this.state.role,
                onChange: this.onChangeText,
                comboData: this.props.lunchbox.role,
            },
        ];
        const tableButtonList =[
            {
                icon: 'edit',
                type: 'Icon',
                color: 'green',
                onClick: this.handleRowClick
            },
            {
                icon: 'delete',
                type: 'Icon',
                color: 'red',
                onClick: this.handleDeleteDialogOpen,
            }
        ];
        const warningTitle = "Are u sure to delete "+ this.state.deleteItemName +" route ?";
        const emptyTableMessage = "There is no data";
        return(
            <MasterTemplate>
                {this.deleteError()}
                <LoadingDialog isLoading={this.state.isLoading} label="Loading Data Please Wait..." />
                <LoadingDialog isLoading={this.state.isSaving} label="Saving Data Please Wait..." />
                <div className ={classes.flex}>
                    <Paper className={classes.root}>
                        <MasterTable fields={fields} data={this.props.lunchbox.route} addNewButton={() => this.addNewButton()} handleRowClick={this.handleRowClick} tableTitle="Route List"
                        page={this.state.page} rowsPerPage={this.state.rowsPerPage} changeRowsPerPage={this.handleChangeRowsPerPage} onChangePage={this.handleChangePage} total={this.state.total}
                        deleteDialog={this.state.deleteDialog} handleDelete={this.handleDelete} deleteWarning={warningTitle} handleDeleteDialogOpen={(name) => this.handleDeleteDialogOpen(name)} handleWarningClose={this.handleWarningClose}
                        onChangeText={this.onChangeText} onKeyPress={this.onKeyPress} tableHeadButtonList={buttonList} tableButtonList={tableButtonList} emptyTableMessage={emptyTableMessage}/>
                    </Paper>
                    <div className={classes.drawer}>
                        <MasterDrawer title="Add New Route" open={this.state.open} onSaveItem={() => this.onSaveItem()} handleClose={this.handleClose} list={DrawerList}/>
                    </div>
                    <Dialog open={this.state.deleteDialog} onClose={this.handleWarningClose} aria-labelledby="form-dialog-title"  BackdropProps={{classes: {root: classes.dialogroot}}} PaperProps ={{classes: {root: classes.paper}}}>
                        <DialogTitle id="form-dialog-title">{warningTitle}</DialogTitle>
                        <DialogActions>
                            <Button onClick={() => this.handleDelete(this.state.deleteItemId)} color="primary">
                            Yes
                            </Button>
                            <Button onClick={this.handleWarningClose} color="primary" autoFocus>
                            No
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </MasterTemplate>
        );
    }
}
RoutePage.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) =>{
    return{
        lunchbox : state
    }
}

export default withRouter(connect(mapStateToProps)(withStyles(styles)(RoutePage)));