import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import {
    Grid,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
    Paper,
    withStyles,
    Dialog,
    DialogTitle,
    DialogActions,
    Button,
    IconButton,
    Icon,
} from '@material-ui/core';

import MasterTemplate from '../../component/MasterTemplate';
import { ROLE_ACTIONS } from '../../redux/RoleRedux';
import RoleApi from '../../api/RoleApi';
import FileApi from '../../api/FileUploadApi';
import { FILE_ACTIONS } from '../../redux/FileRedux';
import MasterDrawer from '../../component/MasterDrawer';
import LoadingDialog from '../../component/LoadingDialog';
import AlertDialog from '../../componentAlertDialog';
import FileUploadApi from '../../api/FileUploadApi';
import FilePaginationAction from '../../component/FilePaginationAction';
import MasterIcon from '../../component/MasterIcon';

const styles = theme => ({
    root: {
        borderRadius: 0,
    },
    flex: {
        width: '100%',
    },
    image: {
        width: '100px',
        height: '100px',
    },
    imageContainer: {
        padding: '16px',
    },
    card: {
        maxWidth: 345,
        width: '100%',
    },
    media: {
        height: 140,
    },
    pagination: {
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'flex-end',
    },
    toolbar: {
        display: 'flex',
        borderBottom: '0.5px solid #ccc',
        alignItems: 'center',
        padding: '10px 0px',
    },
    search: {
        width: 'calc(25%)',
        display: 'flex',
        marginLeft: '25px',
    },
    button: {
        margin: '0px 10px',
        padding: '5px 5px',
    },
    title: {
        width: 'calc(40%)',
        fontSize: '1.5em',
        margin: '0 auto',
        textAlign: 'center',
    },
    buttonField: {
        display: 'flex',
        width: 'calc(35%)',
        justifyContent: 'flex-end',
    },
});

class FileManagePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            description: '',
            previewImage: '/imgs/camera.png',
            file: '',
            open: false,
            filter: null,
            page: 0,
            rowsPerPage: 12,
            total: 0,
            deleteDialog: false,
            orderBy: 'id',
            order: 'desc',
            isLoading: true,
            isSaving: false,
            deleteErrorDialog: false,
        };
    }

    componentDidMount() {
        this._loadData();
        if (this.props.match.params.id) {
            this.loadSelectedItem();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            if (this.props.match.params.id != null) {
                this.loadSelectedItem();
            } else {
                this.setState({ id: '', name: '', description: '' });
            }
        }
        if (
            this.state.page !== prevState.page ||
            this.state.rowsPerPage !== prevState.rowsPerPage ||
            this.state.orderBy !== prevState.orderBy ||
            this.state.order !== prevState.order
        ) {
            this._loadData();
        }
    }

    loadSelectedItem = async () => {
        const data = await FileUploadApi.getById(this.props.match.params.id);
        //console.log("Edit : ", data);
        // this.setState({id:data.id, name:data.name, description:data.description});
    };

    _loadData = async () => {
        const file = await FileUploadApi.getAll(this.state.page, this.state.rowsPerPage, 'id:ASC');
        this.setState({ total: file.total });
        this.props.dispatch({
            type: FILE_ACTIONS.INIT_DATA,
            data: file.data,
        });
        this.setState({ isLoading: false });
    };

    onKeyPress = key => {
        if (key === 'Enter') {
            this._loadData();
        }
    };

    sortHandler = orderBy => {
        let order = 'desc';
        if (this.state.orderBy === orderBy && this.state.order === 'desc') {
            order = 'asc';
        }
        this.setState({ order, orderBy, isLoading: true });
    };

    onChangeImage = event => {
        var reader = new FileReader();
        var file = event.target.files[0];

        reader.onload = () => {
            this.setState({
                file: file,
                previewImage: reader.result,
            });
        };

        reader.readAsDataURL(file);
    };

    handleChangePage = page => {
        this.setState({ page, isLoading: true });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value, isLoading: true });
    };

    addNewButton = () => {
        this.props.match.params.id = null;
        this.props.history.push('/files');
        this.setState({ open: true });
    };

    handleRowClick = data => {
        this.setState({ open: true });
        this.props.history.push('/files/' + data.id);
    };

    handleClose = () => {
        this.setState({ open: false, previewImage: '/imgs/camera.png' });
    };

    handleDeleteDialogOpen = data => {
        this.setState({ deleteDialog: true, deleteItemName: data.name, deleteItemId: data.id });
    };

    handleWarningClose = () => {
        this.setState({ deleteDialog: false });
    };

    handleDelete = async id => {
        try {
            await RoleApi.delete(id);
            this.props.dispatch({
                type: ROLE_ACTIONS.REMOVE,
                id: id,
            });
            this.setState({ deleteDialog: false });
        } catch (error) {
            if (error && error.data.content.message.includes('a foreign key constraint fails')) {
                this.setState({ deleteErrorDialog: true });
            }
        }
        this.setState({ deleteDialog: false });
    };

    deleteError = () => {
        return (
            <AlertDialog
                showDialog={this.state.deleteErrorDialog}
                title="Delete Error"
                description="Cannot delete in-use item"
                onClickOk={this.deleteErrorDialogClose}
            />
        );
    };

    deleteErrorDialogClose = () => {
        this.setState({ deleteErrorDialog: !this.state.deleteErrorDialog });
    };

    validating = () => {
        if (this.state.name === '') {
            this.state.name === '' ? this.setState({ nameError: true }) : this.setState({ nameError: false });
            return true;
        }
        this.setState({ nameError: false });
        return false;
    };

    onSaveItem = async () => {
        // if (this.validating()){
        //     return;
        // }
        // this.setState({isSaving: true});

        var fileUpload;

        try {
            if (this.state.file && this.state.file.id) {
                fileUpload = {
                    id: this.state.file.id,
                };
            } else if (this.state.file && !this.state.file.id) {
                var fileResponse = await FileApi.upload(this.state.file);

                this.props.dispatch({
                    type: FILE_ACTIONS.CREATE_NEW,
                    file: fileResponse,
                });
                // if (fileResponse){
                //     fileUpload = {
                //         id : fileResponse.id
                //     }
                // }
            }
        } catch (error) {
            console.error(error);
        }

        // if(this.props.match.params.id){
        //     role.id = this.state.id;
        //     const response = await RoleApi.update(this.state.id,role);
        //     this.props.dispatch({
        //         type: ROLE_ACTIONS.MODIFIED,
        //         id: this.state.id,
        //         role: response
        //     })
        //     this.setState({isSaving: false});
        // }else{
        //     const response = await RoleApi.insert(role);
        //     this.props.dispatch({
        //         type: ROLE_ACTIONS.CREATE_NEW,
        //         role: response,
        //     })
        //     this.setState({isSaving: false});
        // }
        // this.props.match.params.id = null;
        // this.props.history.push("/roles");
        // this.setState({open: false});
    };

    onChangeText = (key, value) => {
        this.setState({ [key]: value });
    };

    render() {
        const { classes } = this.props;

        const DrawerList = [
            {
                type: 'file',
                label: 'Image',
                image: this.state.previewImage,
                alt: '',
                accept: 'image/*',
                onChangeImage: this.onChangeImage,
            },
        ];
        const warningTitle = 'Are you sure to delete ' + this.state.deleteItemName + ' Role ?';
        return (
            <MasterTemplate>
                {this.deleteError()}
                <LoadingDialog isLoading={this.state.isLoading} label="Loading Data Please Wait..." />
                <LoadingDialog isLoading={this.state.isSaving} label="Saving Data Please Wait..." />
                <div className={classes.flex}>
                    <Paper className={classes.root}>
                        <div className={classes.toolbar}>
                            <div className={classes.search}>
                                <Icon fontSize="small">search</Icon>
                                <input
                                    style={{ border: 'none', outlineWidth: '0' }}
                                    type="text"
                                    name="filter"
                                    placeholder="Search"
                                    onChange={event => this.onChangeText(event.target.name, event.target.value)}
                                    onKeyPress={event => this.onKeyPress(event.key)}
                                />
                            </div>
                            <div className={classes.title}>
                                <span>File Management</span>
                            </div>
                            <div className={classes.buttonField}>
                                <MasterIcon label="Add" icon="add_box" onClick={this.addNewButton} type="IconButton" />
                            </div>
                        </div>
                        <Grid container spacing={16} className={this.props.classes.imageContainer}>
                            {this.props.masterpanel.file.map(row => {
                                return (
                                    <Grid justify="center" container key={row.id} item lg={2} md={4} sm={6} xs={12}>
                                        <Card className={this.props.classes.card}>
                                            <CardActionArea onClick={this.handleRowClick(row.id)}>
                                                <CardMedia className={this.props.classes.media} image={row.public_url} title={row.name} />
                                            </CardActionArea>
                                            <CardContent>
                                                {/* <Typography gutterBottom variant="h6" component="h2">
                                                {row.name}
                                            </Typography> */}
                                                <Typography component="p" style={{ textAlign: 'center' }}>
                                                    {row.size}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                        <div className={classes.pagination}>
                            <FilePaginationAction
                                page={this.state.page}
                                rowsPerPage={this.state.rowsPerPage}
                                changeRowsPerPage={this.handleChangeRowsPerPage}
                                onChangePage={this.handleChangePage}
                                total={this.state.total}
                            />
                        </div>
                    </Paper>
                    <div className={classes.drawer}>
                        <MasterDrawer
                            title="Add New File"
                            open={this.state.open}
                            onSaveItem={() => this.onSaveItem()}
                            handleClose={this.handleClose}
                            list={DrawerList}
                        />
                    </div>
                    <Dialog
                        open={this.state.deleteDialog}
                        onClose={this.handleWarningClose}
                        aria-labelledby="form-dialog-title"
                        BackdropProps={{ classes: { root: classes.dialogroot } }}
                        PaperProps={{ classes: { root: classes.paper } }}
                    >
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
FileManagePage.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return {
        masterpanel: state,
    };
};

export default withRouter(connect(mapStateToProps)(withStyles(styles)(FileManagePage)));
