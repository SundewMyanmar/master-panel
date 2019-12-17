import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import MasterTable from './MasterTable';

import { Paper, IconButton, Typography, Icon, InputBase, Fab, Grid } from '@material-ui/core';
import MasterApi from '../api/MasterApi';
import LoadingDialog from './Dialogs/LoadingDialog';
import QuestionDialog from './Dialogs/QuestionDialog';
import Snackbar from './Snackbar';
import AlertDialog from './Dialogs/AlertDialog';

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
        // color:theme.palette.primary.main
    },
    iconButton: {
        padding: 10,
        color: theme.palette.primary.main,
    },
});

class MasterView extends React.Component {
    constructor(props) {
        super(props);
        this.api = new MasterApi(props.apiURL);
        this.state = {
            currentPage: 0,
            pageSize: 10,
            total: 0,
            pageCount: 1,
            sortBy: 'id:DESC',
            searchText: '',
            showLoading: false,
            showQuestion: false,
            showSnack: false,
            snackMessage: '',
            showError: false,
            errorMessage: '',
            data: [],
            itemToDelete: null,
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
        this.loadData();
    }

    loadData = async () => {
        this.setState({ showLoading: true });
        let newState = {
            currentPage: this.state.currentPage,
            pageSize: this.state.pageSize,
            sortBy: this.state.sortBy,
            searchText: this.state.searchText,
        };

        let result = {};
        try {
            result = await this.api.getPaging(newState.currentPage, newState.pageSize, newState.sortBy, newState.searchText);
            newState.data = result.data;
            newState.total = result.total;
            newState.pageCount = result.page_count;
            newState.sortBy = result.sorts.replace(' ', '');

            if (this.props.onDataWillLoad) {
                newState = await this.props.onDataWillLoad(newState);
            }

            if (this.props.onDataLoaded) {
                this.props.onDataLoaded(newState);
            }
        } catch (error) {
            newState.showError = true;
            newState.errorMessage = 'Please try again. Something wrong!';
        }

        newState.showLoading = false;
        this.setState(newState);
    };

    removeItem = async () => {
        this.setState({ showLoading: true });
        try {
            if (this.props.onItemWillRemove) {
                await this.props.onItemWillRemove(this.state.itemToDelete);
            } else {
                await this.api.delete(this.state.itemToDelete.id);
                this.setState({ showLoading: false, showSnack: true, snackMessage: 'Delete success.' });
            }

            if (this.props.onItemRemove) {
                this.props.onItemRemove();
            }

            this.loadData();
        } catch (error) {
            this.setState({ showLoading: false, showError: true, errorMessage: 'Please try again. Something wrong!' });
        }
    };

    handlePageChange = pagination => {
        this.setState(
            {
                currentPage: pagination.page,
                pageSize: pagination.pageSize,
                sortBy: pagination.sort,
            },
            () => this.loadData(),
        );
    };

    handleAddNew = () => {
        this.props.match.params.id = null;
        this.props.history.push(this.props.detailPath);
    };

    handleEdit = item => {
        this.props.history.push(this.props.detailPath + '/' + item.id);
    };

    handleDelete = item => {
        this.setState({
            itemToDelete: item,
            showQuestion: true,
        });
    };

    handleSearch = () => {
        this.setState({ currentPage: 0 }, () => this.loadData());
    };

    handleSearchKeyDown = e => {
        if (e.keyCode === 13) {
            this.handleSearch();
        }
    };

    handleSearchChange = e => {
        this.setState({ searchText: e.target.value });
    };

    handleQuestionDialog = isDelete => {
        if (isDelete) {
            this.removeItem();
        }
        this.setState({ showQuestion: !this.state.showQuestion });
    };

    handleError = () => {
        this.setState({ showError: false });
    };

    handleSnackBar = () => {
        this.setState({ showSnack: false });
    };

    render() {
        const { classes, title, fields } = this.props;
        return (
            <React.Fragment>
                <LoadingDialog showLoading={this.state.showLoading} message="Loading please wait!" />
                <AlertDialog
                    showDialog={this.state.showError}
                    title="Oops!"
                    description={this.state.errorMessage}
                    onOkButtonClick={this.handleError}
                />
                <Snackbar
                    vertical="top"
                    horizontal="right"
                    showSnack={this.state.showSnack}
                    type="success"
                    message={this.state.snackMessage}
                    onCloseSnackbar={this.handleSnackBar}
                />
                <QuestionDialog
                    itemName={this.state.itemName}
                    showQuestion={this.state.showQuestion}
                    handleQuestionDialog={this.handleQuestionDialog}
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
                                    {title}
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper className={classes.searchPaper}>
                                    <Grid container>
                                        <Grid item xs={10}>
                                            <InputBase
                                                onKeyDown={this.handleSearchKeyDown}
                                                className={classes.input}
                                                value={this.state.searchText ? this.state.searchText : ''}
                                                onChange={this.handleSearchChange}
                                                placeholder="Search.."
                                            />
                                        </Grid>
                                        <Grid container item xs={2} justify="flex-end" alignItems="center">
                                            <IconButton className={classes.iconButton} aria-label="Menu" onClick={this.handleSearch}>
                                                <Icon>search</Icon>
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>

                            <Grid container item xs={4} direction="row" justify="flex-end" alignItems="center">
                                <Fab
                                    onClick={this.handleAddNew}
                                    variant="extended"
                                    aria-label="Add New"
                                    className={[classes.searchPaper, classes.searchButton].join(' ')}
                                >
                                    <Icon>add</Icon>
                                    New
                                </Fab>
                            </Grid>
                        </Grid>
                    </div>
                    <MasterTable
                        items={this.state.data}
                        fields={fields}
                        total={this.state.total}
                        pageSize={this.state.pageSize}
                        currentPage={this.state.currentPage}
                        sortBy={this.state.sortBy}
                        onEditButtonClick={this.handleEdit}
                        onDeleteButtonClick={this.handleDelete}
                        onPageChange={this.handlePageChange}
                        onCheckChange={this.props.onCheckItemChange}
                    />
                </Paper>
            </React.Fragment>
        );
    }
}

MasterView.defaultProps = {
    title: 'Master View',
};

MasterView.propTypes = {
    apiURL: PropTypes.string.isRequired,
    fields: PropTypes.array.isRequired,
    detailPath: PropTypes.string.isRequired,
    title: PropTypes.string,
    onDataWillLoad: PropTypes.func,
    onDataLoaded: PropTypes.func,
    onNewClick: PropTypes.func,
    onEditClick: PropTypes.func,
    onItemWillRemove: PropTypes.func,
    onItemRemove: PropTypes.func,
    onCheckItemChange: PropTypes.func,
};

export default withRouter(withStyles(styles, { withTheme: true })(MasterView));
