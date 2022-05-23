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
import type { DialogProps } from '@material-ui/core';

export interface TablePickerProps extends DialogProps {
    show: boolean;
    selectedData?: Array<Object> | Object;
    multi?: boolean;
    fields: Array<TableField>;
    onError?: (error: object | string) => void;
    onLoad?: (currentPage: number, pageSize: number, sort: string, search: string) => Promise<Any>;
    onClose?: (result: object | Array<Object>) => void;
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom in ref={ref} {...props} />;
});

const styles = makeStyles((theme) => ({
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
    closeButton: {
        color: theme.palette.text.primary,
    },
}));

const TablePicker = (props: TablePickerProps) => {
    const classes = styles();
    const { title, multi, selectedData, show, fields, onLoad, onClose, onError } = props;
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [checked, setChecked] = useState(() => {
        if (multi && !selectedData) {
            return [];
        }

        return selectedData;
    });
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
            sort: 'modifiedAt:DESC',
        };
    });

    //Set value if props.value changed.
    React.useEffect(() => {
        if (multi && !selectedData) {
            setChecked([]);
        } else {
            setChecked(selectedData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedData]);

    useEffect(() => {
        if (!loading) {
            loadData(0, paging.pageSize, paging.sort);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    useEffect(() => {
        if (show && search.length > 0) {
            setSearch('');
        } else if (show) {
            loadData(0, paging.pageSize, paging.sort);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    const handlePageChange = (pagination) => {
        loadData(pagination.page, pagination.pageSize, pagination.sort);
    };

    const handleSelectionChange = (result) => {
        if (multi) {
            setChecked(result);
        }
    };

    const handleRowClick = (item) => {
        if (!multi) {
            onClose(item);
            return;
        }
    };

    const handleClose = (action) => {
        if (!multi) {
            onClose(false);
            return;
        }

        if (action) {
            onClose(checked);
        } else {
            setChecked(selectedData || []);
            onClose(false);
        }
    };

    return (
        <Dialog fullWidth maxWidth="lg" onClose={() => handleClose(false)} open={show} TransitionComponent={Transition}>
            <DialogTitle className={classes.header}>
                <Grid container>
                    <Grid container item lg={4} md={4} sm={12} xs={12} alignItems="center" justifyContent="flex-start">
                        <Typography variant="h6" component="h1" noWrap>
                            {title}
                        </Typography>
                    </Grid>
                    <Grid container item lg={4} md={4} sm={8} xs={12} alignItems="center" justifyContent="center" alignContent="flex-start">
                        <SearchInput onSearch={(value) => setSearch(value)} placeholder="Search" />
                    </Grid>
                    <Grid container item lg={4} md={4} sm={4} xs={12} alignItems="center" justifyContent="flex-end">
                        <Tooltip title="Close Dialog">
                            <IconButton size="small" className={classes.closeButton} onClick={() => handleClose(false)} aria-label="Close">
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
                    onRowClick={multi ? null : handleRowClick}
                />
            </DialogContent>
            {multi ? (
                <DialogActions>
                    <Button onClick={() => handleClose(true)} color="primary" variant="contained">
                        <Icon>done</Icon> Ok
                    </Button>
                    <Button onClick={() => handleClose(false)} color="default" variant="contained">
                        <Icon>done</Icon> Cancel
                    </Button>
                </DialogActions>
            ) : null}
        </Dialog>
    );
};

TablePicker.defaultProps = {
    title: 'Data List',
    selectedData: [],
    multi: false,
    onError: (error) => console.warn('Undefined onError => ', error),
    onSelectionChange: (result) => console.warn('Undefined onSelectionChange => ', result),
};

export default TablePicker;
