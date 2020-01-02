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
        let newState = {
            showTableDialog: !this.state.showTableDialog,
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

    handleSelectionChange = items => {
        this.setState({ items: items });
    };

    render() {
        const { classes, fields, apiURL, title, onDataWillLoad, onDataLoaded, onItemLabelWillLoad } = this.props;
        return (
            <React.Fragment>
                <TableDialog
                    showDialog={this.state.showTableDialog}
                    onDialogClose={this.handleTableDialog}
                    title={title}
                    fields={fields}
                    apiURL={apiURL}
                    onSelectionChange={this.handleSelectionChange}
                    multiSelect={true}
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
                </Paper>
            </React.Fragment>
        );
    }
}

TablePicker.defaultProps = {
    title: 'Choose Item',
    onItemLabelWillLoad: item => (item.label ? item.label : item.id),
    onItemRemove: item => console.log('Item removed => ', item),
    onSelectionChange: data => console.log('Changed selected data => ', data),
};

TablePicker.propTypes = {
    title: PropTypes.string,
    fields: PropTypes.array.isRequired,
    apiURL: PropTypes.string.isRequired,
    initData: PropTypes.array,
    onDataWillLoad: PropTypes.func,
    onDataLoaded: PropTypes.func,
    onItemLabelWillLoad: PropTypes.func,
    onSelectionChange: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(TablePicker);
