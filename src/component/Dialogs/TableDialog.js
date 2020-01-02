import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Icon,
    Grid,
    Paper,
    InputBase,
    Typography,
    Tooltip,
} from '@material-ui/core';
import MasterApi from '../../api/MasterApi';
import MasterTable from '../MasterTable';

const styles = theme => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
        color: 'white',
    },
    card: {
        maxWidth: 345,
        width: '100%',
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    pager: {
        flexShrink: 0,
    },
    input: {
        marginLeft: 8,
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    table: {
        minWidth: 700,
    },
    toolbar: {
        display: 'flex',
        borderBottom: '0.5px solid #ccc',
        alignItems: 'center',
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    search: {
        width: 'calc(25%)',
        display: 'flex',
        marginLeft: '25px',
    },
    pagination: {
        overflow: 'hidden',
        display: 'flex',
    },
    button: {
        margin: '0px 10px',
        padding: '5px 5px',
    },
    buttonField: {
        display: 'flex',
        width: 'calc(25%)',
        justifyContent: 'flex-end',
    },
});

class TableDialog extends React.Component {
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
            data: [],
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = async () => {
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
            this.props.onError(error);
        }

        this.setState(newState);
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

    handleRowClick = item => {
        const { multiSelect, selectedData, onDialogClose, onSelectionChange } = this.props;
        if (!multiSelect) {
            onSelectionChange(item);
            onDialogClose(true);
            return;
        }
        let currentSelection = [];
        if (selectedData) {
            currentSelection = selectedData;
            const existItem = selectedData.find(row => row.id === item.id);
            if (existItem) {
                currentSelection = selectedData.filter(row => row.id !== item.id);
                onSelectionChange(currentSelection);
                return;
            }
        }

        currentSelection = [...currentSelection, item];
        onSelectionChange(currentSelection);
    };

    renderHeader = () => {
        const { classes, title } = this.props;
        return (
            <Grid container>
                <Grid container item xs={4} alignItems="center">
                    <Typography style={{ color: 'white' }} variant="h6" component="h1" noWrap>
                        {title}
                    </Typography>
                </Grid>
                <Grid container item xs={4} alignItems="center" justify="center">
                    <Paper className={classes.root}>
                        <InputBase
                            className={classes.input}
                            placeholder="Search Files"
                            inputProps={{ 'aria-label': 'Search Files' }}
                            value={this.state.searchText}
                            onKeyDown={this.handleSearchKeyDown}
                            onChange={this.handleSearchChange}
                        />
                        <IconButton className={classes.iconButton} aria-label="Search" onClick={this.handleSearch}>
                            <Icon>search</Icon>
                        </IconButton>
                    </Paper>
                </Grid>
                <Grid container item xs={4} alignItems="center" justify="flex-end">
                    <Tooltip title="Close Dialog">
                        <IconButton style={{ color: 'white' }} onClick={() => this.props.onDialogClose(false)} aria-label="Close">
                            <Icon>close</Icon>
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        );
    };

    renderActionBar = () => {
        if (this.props.multiSelect) {
            return (
                <DialogActions>
                    <Button onClick={() => this.props.onDialogClose(false)}>Cancel</Button>
                    <Button onClick={() => this.props.onDialogClose(true)}>Ok</Button>
                </DialogActions>
            );
        }

        return null;
    };

    render() {
        const { fields, selectedData, theme, showDialog } = this.props;
        const { data } = this.state;
        let items = data;
        if (selectedData) {
            items = data.map(item => {
                const markedItem = selectedData.find(row => row.id === item.id);
                return { ...item, marked: markedItem };
            });
        }

        return (
            <Dialog fullWidth maxWidth="md" open={showDialog}>
                <DialogTitle style={{ borderRadius: 0, padding: '8px 24px', backgroundColor: theme.palette.primary.main }}>
                    {this.renderHeader()}
                </DialogTitle>
                <DialogContent style={{ padding: '0px' }}>
                    <MasterTable
                        items={items}
                        fields={fields}
                        total={this.state.total}
                        pageSize={this.state.pageSize}
                        currentPage={this.state.currentPage}
                        sortBy={this.state.sortBy}
                        onPageChange={this.handlePageChange}
                        onRowClick={this.handleRowClick}
                    />
                </DialogContent>
                {this.renderActionBar()}
            </Dialog>
        );
    }
}

TableDialog.defaultProps = {
    title: 'Master View',
    multiSelect: true,
    onSelectionChange: items => console.log('Selected Item ', items),
    onError: error => console.log('Error => ', error),
};

TableDialog.propTypes = {
    apiURL: PropTypes.string.isRequired,
    fields: PropTypes.array.isRequired,
    showDialog: PropTypes.bool.isRequired,
    onDialogClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    multiSelect: PropTypes.bool,
    selectedData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    onDataWillLoad: PropTypes.func,
    onDataLoaded: PropTypes.func,
    onSelectionChange: PropTypes.func,
    onError: PropTypes.func,
};
export default withStyles(styles, { withTheme: true })(TableDialog);
