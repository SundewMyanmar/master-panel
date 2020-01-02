import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import {
    Paper,
    IconButton,
    Typography,
    Icon,
    InputBase,
    Fab,
    Grid,
    CardActionArea,
    CardMedia,
    Divider,
    Card,
    CardContent,
    Table,
    TableFooter,
    TableRow,
} from '@material-ui/core';

import QuestionDialog from '../../component/Dialogs/QuestionDialog';
import LoadingDialog from '../../component/Dialogs/LoadingDialog';
import AlertDialog from '../../component/Dialogs/AlertDialog';
import ImageDialog from '../../component/Dialogs/ImageDialog';
import Snackbar from '../../component/Snackbar';
import MasterPaginationBar from '../../component/MasterPaginationBar';
import FileApi from '../../api/FileApi';
import { FILE_ACTIONS } from '../../redux/FileRedux';

const styles = theme => ({
    searchPaper: {
        marginLeft: 16,
        marginTop: 16,
        marginBottom: 10,
        marginRight: 5,
    },
    searchHeader: {
        flex: 1,
        // backgroundColor:theme.palette.primary.main,
        borderBottom: '1px solid #eff6f7',
    },
    searchHeaderText: {
        marginLeft: 24,
    },
    searchButton: {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.primary.main,
        marginRight: 5,
    },
    searchIcon: {
        color: theme.palette.primary.main,
    },
    input: {
        flex: 1,
        marginLeft: 12,
        marginTop: 6,
        width: '100%',
    },
    iconButton: {
        padding: 10,
        color: theme.palette.primary.main,
    },
    card: {
        maxWidth: 345,
        width: '100%',
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
});

class FilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 0,
            pageSize: 18,
            total: 0,
            pageCount: 1,
            showLoading: false,
            showQuestion: false,
            showSnack: false,
            snackMessage: '',
            showError: false,
            errorMessage: '',
            showImage: false,
            itemToDelete: null,
            data: [],
        };
    }

    componentDidMount() {
        const query = new URLSearchParams(this.props.location.search);
        if (query.get('callback') === 'success') {
            this.setState({
                showSnack: true,
                snackMessage: 'Save success.',
            });
        }
        this.loadFiles();
    }

    loadFiles = async () => {
        this.setState({ showLoading: true });
        let newState = {
            showLoading: false,
        };

        try {
            const result = await FileApi.getPaging(this.state.currentPage, this.state.pageSize, 'createdAt:DESC', this.state.searchText);
            if (result.count > 0) {
                newState.data = result.data;
                newState.total = result.total;
                newState.pageCount = result.pageCount;
            }
        } catch (error) {
            console.log('Load Files => ', error);
            this.props.onError(error);
        }
        this.setState(newState);
    };

    handlePageSizeChange = pageSize => {
        this.setState({ currentPage: 0, pageSize: pageSize }, () => this.loadFiles());
    };

    handlePageChange = page => {
        this.setState({ currentPage: page }, () => this.loadFiles());
    };

    handleSearch = () => {
        this.setState({ currentPage: 0 }, () => this.loadFiles());
    };

    handleSearchChange = e => {
        this.setState({ searchText: e.target.value });
    };

    handleSearchKeyDown = e => {
        if (e.keyCode === 13) {
            this.handleSearch();
        }
    };

    handleUploadImage = async event => {
        try {
            var reader = new FileReader();
            var file = event.target.files[0];
            reader.readAsDataURL(file);
            if (file) {
                var fileResponse = await FileApi.upload(file);
                if (fileResponse) {
                    this.loadFiles();
                }
            }
        } catch (error) {
            console.error('File Upload => ', error);
            this.props.onError(error);
        }
    };

    handleQuestionDialog = isDelete => {
        if (isDelete && this.state.itemToDelete) {
            this.handleDeleteFile(this.state.itemToDelete.id);
        }
        this.setState({ showQuestion: !this.state.showQuestion });
    };

    handleAddNewButton() {
        this.props.match.params.id = null;
        this.props.history.push('/file/setup/detail');
    }

    handleDeleteFile = async id => {
        this.setState({ showLoading: true });
        try {
            await FileApi.delete(id);
            this.props.dispatch({
                type: FILE_ACTIONS.REMOVE,
                id: id,
            });
            this.setState({
                showLoading: false,
                showSnack: true,
                snackMessage: 'Delete success.',
                showImage: false,
                itemToDelete: null,
            });
        } catch (error) {
            this.setState({
                showLoading: false,
                showError: true,
                errorMessage: 'Please try again. Something wrong!',
            });
        }
    };

    handleClick = data => {
        this.setState({ showImage: true, file: data });
    };

    handleImageDialog = () => {
        this.setState({ showImage: !this.state.showImage });
    };

    handleImageRemove = data => {
        this.setState({
            itemToDelete: data,
            showQuestion: true,
        });
    };

    renderHeader = () => {
        const { classes } = this.props;
        return (
            <Grid container>
                <Grid container item xs={4} direction="row" justify="flex-start" alignItems="center">
                    <Typography
                        className={[classes.searchHeaderText, classes.searchPaper].join(' ')}
                        style={{ color: this.props.theme.palette.primary.main }}
                        variant="h6"
                        component="h1"
                        noWrap
                    >
                        Files
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Paper className={classes.searchPaper}>
                        <Grid container>
                            <Grid item xs={10}>
                                <InputBase
                                    className={classes.input}
                                    placeholder="Search Files"
                                    inputProps={{ 'aria-label': 'Search Files' }}
                                    value={this.state.searchText}
                                    onKeyDown={this.handleSearchKeyDown}
                                    onChange={this.handleSearchChange}
                                />
                            </Grid>
                            <Grid container item xs={2} justify="flex-end" alignItems="center">
                                <IconButton className={classes.iconButton} aria-label="Search" onClick={this.handleSearch}>
                                    <Icon>search</Icon>
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid container item xs={4} direction="row" justify="flex-end" alignItems="center">
                    <Fab
                        onClick={() => this.handleAddNewButton()}
                        variant="extended"
                        aria-label="Delete"
                        className={[classes.searchPaper, classes.searchButton].join(' ')}
                    >
                        <Icon className={classes.searchIcon}>add</Icon>
                        New
                    </Fab>
                </Grid>
            </Grid>
        );
    };

    renderItem = item => {
        const { classes } = this.props;
        return (
            <Grid key={item.id} container item justify="center" xs={12} sm={12} md={6} lg={2}>
                <Card className={classes.card} onClick={() => this.handleClick(item)}>
                    <CardActionArea>
                        <CardMedia
                            className={classes.media}
                            image={item.public_url ? item.public_url : '/res/default-image.png'}
                            title={item.name ? item.name : 'No Image'}
                        />
                        <Divider light />
                        <CardContent style={{ padding: '4px 8px 8px 8px' }}>
                            <Typography style={{ marginBottom: 4 }} variant="subtitle2" align="center" noWrap>
                                {item.name}
                            </Typography>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Typography variant="caption">{item.size}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="caption" align="right">
                                        {item.extension}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        );
    };

    render() {
        const { classes } = this.props;

        return (
            <div>
                <LoadingDialog showLoading={this.state.showLoading} message="Loading please wait!" />
                <AlertDialog
                    showDialog={this.state.showError}
                    title="Oops!"
                    description={this.state.errorMessage}
                    onOkButtonClick={() => this.setState({ showError: false })}
                />
                <Snackbar
                    vertical="top"
                    horizontal="right"
                    showSnack={this.state.showSnack}
                    type="success"
                    message={this.state.snackMessage}
                    onCloseSnackbar={() => this.setState({ showSnack: false })}
                />
                <QuestionDialog
                    itemName={this.state.itemToDelete ? this.state.itemToDelete.name : 'None'}
                    showQuestion={this.state.showQuestion}
                    onDialogAction={this.handleQuestionDialog}
                />
                <ImageDialog
                    showDialog={this.state.showImage}
                    onCloseImage={this.handleImageDialog}
                    data={this.state.file}
                    onRemoveImage={this.handleImageRemove}
                />
                <Paper className={classes.root}>
                    <div className={classes.searchHeader}>{this.renderHeader()}</div>
                    <Grid container spacing={2} style={{ padding: 8 }}>
                        {this.state.data.map(this.renderItem)}
                    </Grid>
                    <Table className={classes.table}>
                        <TableFooter>
                            <TableRow>
                                <MasterPaginationBar
                                    rowsPerPage={[9, 18, 36]}
                                    total={this.state.total}
                                    pageSize={this.state.pageSize}
                                    currentPage={this.state.currentPage}
                                    onPageChange={this.handlePageChange}
                                    onPageSizeChange={this.handlePageSizeChange}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </Paper>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        files: state.file,
    };
};

export default withRouter(connect(mapStateToProps)(withStyles(styles, { withTheme: true })(FilePage)));
