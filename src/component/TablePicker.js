import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Chip, Typography, Tooltip, IconButton, Icon, Divider, Grid } from '@material-ui/core';
import TableDialog from './Dialogs/TableDialog';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(0.5),
        width: '100%',
    },
    chip: {
        margin: theme.spacing(0.5),
    },
    chipContainer: {
        display: 'flex',
        justifyContent: 'start',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    chipButton: {
        width: 'calc(50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    chipLabel: {
        color: theme.palette.text.light,
        textAlign: 'start',
        paddingLeft: theme.spacing(1),
    },
    chipDivider: {
        display: 'flex',
        width: '100%',
        marginBottom: theme.spacing(1),
    },
});

class TablePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayText: '',
            items: [],
            prevItems: [],
            showTableDialog: false,
            readyToInit: true,
        };
    }

    componentDidMount() {
        this.setState({ readyToInit: true });
    }

    componentDidUpdate(prevProps) {
        const prevData = prevProps.initData ? prevProps.initData : [];
        const currentData = this.props.initData ? this.props.initData : [];
        if (this.state.readyToInit && currentData && prevData.length === 0 && prevData.length !== currentData.length) {
            this.setState({ items: currentData, readyToInit: false });
        }
    }

    handleTableDialog = result => {
        if (!this.props.multiSelect) {
            this.setState({ showTableDialog: false });
            return;
        }

        let newState = {
            showTableDialog: false,
            items: result ? this.state.items : this.state.prevItems,
            prevItems: result ? this.state.items : this.state.prevItems,
        };
        if (result) {
            this.props.onSelectionChange(newState.items);
        }
        this.setState(newState);
    };

    handleItemRemove = item => {
        const items = this.state.items.filter(i => i.id !== item.id);
        this.props.onSelectionChange(items);
        this.setState({ items: items, prevItems: items });
    };

    handleSelectionChange = data => {
        if (!this.props.multiSelect) {
            const display = this.props.onItemLabelWillLoad(data);
            this.setState({
                showTableDialog: false,
                displayText: display,
            });
            this.props.onSelectionChange(data);
            return;
        }

        this.setState({ items: data });
    };

    renderMultiInput = () => {
        const { classes, onItemLabelWillLoad } = this.props;
        return (
            <Grid container>
                <Grid container item xs={10} sm={10} className={classes.chipContainer}>
                    {this.state.items.map((item, index) => {
                        const label = onItemLabelWillLoad(item);
                        return (
                            <Chip
                                className={classes.chip}
                                key={item.id ? item.id : index}
                                label={label}
                                onDelete={() => this.handleItemRemove(item)}
                            />
                        );
                    })}
                </Grid>
                <Grid className={classes.chipButton} container item xs={2} sm={2}>
                    <Tooltip title="Add Child" placement="left">
                        <IconButton onClick={() => this.setState({ showTableDialog: true })} color="primary" aria-label="Add Child">
                            <Icon>playlist_add_check</Icon>
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Divider light className={classes.chipDivider} variant="fullWidth" />
            </Grid>
        );
    };

    renderSingleInput = () => {
        const { classes, theme } = this.props;
        return (
            <Grid container>
                <Grid container item xs={10} sm={10} className={classes.chipContainer}>
                    <Typography
                        variant="body1"
                        style={{
                            color: theme.palette.primary.main,
                            marginTop: 20,
                            marginLeft: 8,
                        }}
                    >
                        {this.state.displayText}
                    </Typography>
                </Grid>
                <Grid className={classes.chipButton} container item xs={2} sm={2}>
                    <Tooltip title="Add Child" placement="left">
                        <IconButton onClick={() => this.setState({ showTableDialog: true })} color="primary" aria-label="Add Child">
                            <Icon>playlist_add_check</Icon>
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Divider light className={classes.chipDivider} variant="fullWidth" />
            </Grid>
        );
    };

    render() {
        const { classes, title, multiSelect, fields, apiURL, onDataLoaded, onDataWillLoad } = this.props;
        return (
            <React.Fragment>
                <TableDialog
                    showDialog={this.state.showTableDialog}
                    onDialogClose={this.handleTableDialog}
                    title={title}
                    fields={fields}
                    apiURL={apiURL}
                    onSelectionChange={this.handleSelectionChange}
                    multiSelect={multiSelect}
                    selectedData={this.state.items}
                    onDataWillLoad={onDataWillLoad}
                    onDataLoaded={onDataLoaded}
                />
                <Paper className={classes.root}>
                    <Grid container className={classes.chipLabel}>
                        <Typography
                            style={this.state.clientError ? { color: '#f44336' } : { color: 'rgba(0, 0, 0, 0.87)' }}
                            variant="subtitle1"
                            gutterBottom
                        >
                            {title}
                        </Typography>
                    </Grid>
                    {multiSelect ? this.renderMultiInput() : this.renderSingleInput()}
                </Paper>
            </React.Fragment>
        );
    }
}

TablePicker.defaultProps = {
    title: 'Choose Item',
    multiSelect: true,
    onItemLabelWillLoad: item => (item.label ? item.label : item.id),
    onItemRemove: item => console.log('Item removed => ', item),
    onSelectionChange: data => console.log('Changed selected data => ', data),
};

TablePicker.propTypes = {
    title: PropTypes.string,
    fields: PropTypes.array.isRequired,
    apiURL: PropTypes.string.isRequired,
    initData: PropTypes.array,
    multiSelect: PropTypes.bool,
    onDataWillLoad: PropTypes.func,
    onDataLoaded: PropTypes.func,
    onItemLabelWillLoad: PropTypes.func,
    onSelectionChange: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(TablePicker);
