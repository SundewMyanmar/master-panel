import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import QuestionDialog from '../../component/Dialogs/QuestionDialog';
import LoadingDialog from '../../component/Dialogs/LoadingDialog';
import AlertDialog from '../../component/Dialogs/AlertDialog';
import ImageDialog from '../../component/Dialogs/ImageDialog';
import Snackbar from '../../component/Snackbar';
import FileApi from '../../api/FileApi';
import { FILE_ACTIONS } from '../../redux/FileRedux';
import GridView from '../../component/FileGridView';

import { Paper, IconButton, Typography, Icon, InputBase, Fab, Grid } from '@material-ui/core';

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

        this._loadData();
    }

    addNew() {
        this.props.match.params.id = null;
        this.props.history.push('/file/setup/detail');
    }

    delete(id, name, _this) {
        _this.setState({
            itemName: name,
            itemToDelete: id,
            showQuestion: true,
        });
    }

    handleQuestionDialog = isDelete => {
        if (isDelete) {
            this.onDeleteItem(this.state.itemToDelete);
        }
        this.setState({ showQuestion: !this.state.showQuestion });
    };

    onDeleteItem = async id => {
        this.setState({ showLoading: true });
        try {
            await FileApi.delete(id);
            this.props.dispatch({
                type: FILE_ACTIONS.REMOVE,
                id: id,
            });
            this.setState({ showLoading: false, showSnack: true, snackMessage: 'Delete success.', showImage: false });
        } catch (error) {
            this.setState({ showLoading: false, showError: true, errorMessage: 'Please try again. Something wrong!' });
        }
    };

    _loadData = () => {
        this.paging();
    };

    handleChangePage(e) {}

    handleChangeRowsPerPage(e, _this) {
        _this.setState(
            {
                pageSize: e.target.value,
            },
            () => {
                _this.paging();
            },
        );
    }

    pageChange = (pageParam, _this) => {
        var currentPage = _this.state.currentPage;
        if (pageParam === 'first') {
            currentPage = 0;
        } else if (pageParam === 'previous') {
            if (currentPage > 0) currentPage -= 1;
            else currentPage = _this.state.pageCount - 1;
        } else if (pageParam === 'forward') {
            if (currentPage === _this.state.pageCount - 1) currentPage = 0;
            else currentPage += 1;
        } else if (pageParam === 'last') {
            currentPage = _this.state.pageCount - 1;
        }

        _this.setState(
            {
                currentPage: currentPage,
                showLoading: true,
            },
            () => {
                _this.paging();
            },
        );
    };

    onKeyDown = e => {
        if (e.keyCode === 13) {
            this.onSearch();
        }
    };

    onSearch() {
        this.setState(
            {
                currentPage: 0,
            },
            () => {
                this.paging();
            },
        );
    }

    onChangeText = (key, value) => {
        this.setState({
            searchFilter: value,
        });
    };

    paging = async () => {
        this.setState({ showLoading: true });
        try {
            var result = await FileApi.getPaging(this.state.currentPage, this.state.pageSize, 'createdAt:DESC', this.state.searchFilter);
            this.setState({ total: result.total, pageCount: result.page_count, showLoading: false });

            if (result.count > 0) {
                this.props.dispatch({
                    type: FILE_ACTIONS.INIT_DATA,
                    data: result.data,
                });
            } else {
                this.props.dispatch({
                    type: FILE_ACTIONS.INIT_DATA,
                    data: [],
                });

                this.setState({ showLoading: false, showError: true, errorMessage: 'There is no data to show.' });
            }
        } catch (error) {
            this.props.dispatch({
                type: FILE_ACTIONS.INIT_DATA,
                data: [],
            });
        }
    };

    handleError = () => {
        this.setState({ showError: false });
    };

    onCloseSnackbar = () => {
        this.setState({ showSnack: false });
    };

    onClickCard = data => {
        this.setState({ showImage: true, file: data });
    };

    handleImageDialog = () => {
        this.setState({ showImage: !this.state.showImage });
    };

    onLoadImage = ({ target: img }) => {
        this.setState({ height: img.offsetHeight, width: img.offsetWidth });
    };

    render() {
        const { classes } = this.props;

        return (
            <div>
                <LoadingDialog showLoading={this.state.showLoading} message="Loading please wait!" />
                <AlertDialog showDialog={this.state.showError} title="Oops!" description={this.state.errorMessage} onClickOk={this.handleError} />
                <Snackbar
                    vertical="top"
                    horizontal="right"
                    showSnack={this.state.showSnack}
                    type="success"
                    message={this.state.snackMessage}
                    onCloseSnackbar={this.onCloseSnackbar}
                />
                <QuestionDialog
                    itemName={this.state.itemName}
                    showQuestion={this.state.showQuestion}
                    handleQuestionDialog={this.handleQuestionDialog}
                />
                <ImageDialog
                    showImage={this.state.showImage}
                    onClose={this.handleImageDialog}
                    data={this.state.file}
                    onLoadImage={this.onLoadImage}
                    width={this.state.width}
                    height={this.state.height}
                    editButton={this.edit}
                    deleteButton={this.delete}
                    _this={this}
                />
                <Paper className={classes.root}>
                    <div className={classes.searchHeader}>
                        <Grid container>
                            <Grid container item xs={4} direction="row" justify="flex-start" alignItems="center">
                                <Typography
                                    className={[classes.searchHeaderText, classes.searchPaper].join(' ')}
                                    style={{ color: this.props.theme.palette.primary.main }}
                                    variant="h6"
                                    component="h1"
                                    noWrap
                                >
                                    File List
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={classes.searchPaper}>
                                    <Grid container>
                                        <Grid item xs={10}>
                                            <InputBase
                                                onKeyDown={this.onKeyDown}
                                                className={classes.input}
                                                value={this.state.searchFilter ? this.state.searchFilter : ''}
                                                onChange={event => this.onChangeText(event.target.id, event.target.value)}
                                                placeholder="Search Files.."
                                            />
                                        </Grid>
                                        <Grid container item xs={2} justify="flex-end" alignItems="center">
                                            <IconButton className={classes.iconButton} aria-label="Menu" onClick={() => this.onSearch()}>
                                                <Icon>search</Icon>
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>

                            <Grid container item xs={4} direction="row" justify="flex-end" alignItems="center">
                                <Fab
                                    onClick={() => this.addNew()}
                                    variant="extended"
                                    aria-label="Delete"
                                    className={[classes.searchPaper, classes.searchButton].join(' ')}
                                >
                                    <Icon className={classes.searchIcon}>add</Icon>
                                    New
                                </Fab>
                            </Grid>
                        </Grid>
                    </div>
                    <GridView
                        items={this.props.masterpanel.file}
                        total={this.state.total}
                        pageSize={this.state.pageSize}
                        currentPage={this.state.currentPage}
                        pageChange={this.pageChange}
                        handleChangePage={this.handleChangePage}
                        handleChangeRowsPerPage={this.handleChangeRowsPerPage}
                        _this={this}
                        onClickCard={this.onClickCard}
                        closeAction={this.closeAction}
                        editButton={this.edit}
                        handleImageDialog={this.handleImageDialog}
                    />
                </Paper>
            </div>
        );
    }
}

FilePage.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return {
        masterpanel: state,
    };
};

export default withRouter(connect(mapStateToProps)(withStyles(styles, { withTheme: true })(FilePage)));
