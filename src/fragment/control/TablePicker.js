import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    Typography,
    Zoom,
    LinearProgress,
    makeStyles,
    Icon,
    DialogActions,
    Button,
    Tooltip,
    IconButton,
} from '@material-ui/core';
import SearchInput from './SearchInput';
import DataTable from '../table';

type TablePickerProps = {
    show: Boolean,
    selectedData?: Array<Object> | Object,
    multi?: Boolean,
    fields: Array<TableField>,
    onError(error: Object | String): ?Function,
    onLoad(currentPage: Number, pageSize: Number, sort: String, search: String): (?Function) => Promise<Any>,
    onClose(result: Object | Array<Object>): Function,
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom in ref={ref} {...props} />;
});

const styles = makeStyles(theme => ({
    content: {
        backgroundColor: theme.palette.background.default,
        borderTop: '1px solid ' + theme.palette.divider,
        borderBottom: '1px solid ' + theme.palette.divider,
        padding: 0,
    },
    header: {
        padding: theme.spacing(1, 2),
    },
    noLoading: {
        height: 4,
        display: 'block',
    },
}));

const TablePicker = (props: TablePickerProps) => {
    const classes = styles();
    const { title, multi, selectedData, show, fields, onLoad, onClose, onError } = props;
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [checked, setChecked] = useState(selectedData);
    const loadData = async (currentPage, pageSize, sort) => {
        setLoading(true);
        try {
            const result = await onLoad(currentPage, pageSize, sort, search);
            setPaging(result);
        } catch (error) {
            onError(error);
        }
        setLoading(false);
    };

    const [paging, setPaging] = useState(() => {
        return {
            currentPage: 0,
            pageSize: 10,
            total: 0,
            data: [],
            sort: 'id:DESC',
        };
    });

    //Set value if props.value changed.
    React.useEffect(() => {
        setChecked(selectedData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedData]);

    useEffect(() => {
        loadData(0, paging.pageSize, paging.sort);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const handlePageChange = pagination => {
        loadData(pagination.page, pagination.pageSize, pagination.sort);
    };

    const handleSelectionChange = result => {
        if (multi) {
            setChecked(result);
        }
    };

    const handleRowClick = item => {
        if (!multi) {
            onClose(item);
            return;
        }
    };

    return (
        <>
            <Dialog fullWidth maxWidth="lg" onEscapeKeyDown={() => onClose(false)} open={show} TransitionComponent={Transition}>
                <DialogTitle className={classes.header}>
                    <Grid container>
                        <Grid container item lg={4} md={4} sm={12} xs={12} alignItems="center" justify="flex-start">
                            <Typography color="primary" variant="h6" component="h1" noWrap>
                                {title}
                            </Typography>
                        </Grid>
                        <Grid container item lg={4} md={4} sm={8} xs={12} alignItems="center" justify="center" alignContent="flex-start">
                            <SearchInput onSearch={value => setSearch(value)} placeholder="Search Files" />
                        </Grid>
                        <Grid container item lg={4} md={4} sm={4} xs={12} alignItems="center" justify="flex-end">
                            <Tooltip title="Close Dialog">
                                <IconButton size="small" color="primary" onClick={() => onClose(false)} aria-label="Close">
                                    <Icon>close</Icon>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent className={classes.content}>
                    {loading ? <LinearProgress /> : <div className={classes.noLoading}></div>}
                    <DataTable
                        multi={multi}
                        items={paging.data}
                        fields={fields}
                        total={paging.total}
                        pageSize={paging.pageSize}
                        currentPage={paging.currentPage}
                        sort={paging.sort}
                        selectedData={checked}
                        onPageChange={handlePageChange}
                        onSelectionChange={handleSelectionChange}
                        onRowClick={handleRowClick}
                    />
                </DialogContent>
                {multi ? (
                    <DialogActions>
                        <Button onClick={() => onClose(checked)} color="primary" variant="contained">
                            Ok
                        </Button>
                        <Button onClick={() => onClose(false)} color="secondary" variant="contained">
                            Cancel
                        </Button>
                    </DialogActions>
                ) : null}
            </Dialog>
        </>
    );
};

TablePicker.defaultProps = {
    title: 'Data List',
    selectedData: [],
    multi: false,
    onError: error => console.warn('Undefined onError => ', error),
    onSelectionChange: result => console.warn('Undefined onSelectionChange => ', result),
};

export default TablePicker;
