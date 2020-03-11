import React, { useState, useEffect } from 'react';
import { Typography, Paper, makeStyles, Grid, Icon, Button } from '@material-ui/core';
import DataTable, { TableField } from './table';
import { QuestionDialog, LoadingDialog } from './message';
import { SearchInput } from './control';
import ActionMenu from './table/ActionMenu';
import DataAction from './table/DataAction';
import FormatManager from '../util/FormatManager';

const styles = makeStyles(theme => ({
    header: {
        flex: 1,
        // backgroundColor:theme.palette.primary.main,
        borderBottom: '1px solid #eff6f7',
        padding: theme.spacing(1),
    },
    newButton: {
        marginLeft: theme.spacing(1),
    },
    deleteButton: {
        color: theme.palette.error.main,
        '&:hover': {
            color: theme.palette.error.dark,
        },
    },
    editButton: {
        color: theme.palette.secondary.main,
        '&:hover': {
            color: theme.palette.secondary.dark,
        },
    },
}));

export type PaginationObject = {
    currentPage: Number,
    pageSize: Number,
    total: Number,
    data: Array<Object>,
    sort: String,
};

export type ActionProps = {
    id: String,
    label: String,
    icon: String,
};

type MasterTableProps = {
    fields: Array<TableField>,
    moreActions: Array<ActionProps>,
    title?: String,
    onAddNew?: Function,
    onEdit(item: Object): ?Function,
    onLoad(currentPage: Number, pageSize: Number, sort: String, search: String): (?Function) => Promise<Any>,
    onRemove(removeData: Object | Array): (?Function) => Promise<Any>,
    onError(error: Object | String): ?Function,
    onItemAction(item: Object, data: Object): ?Function,
    onRowClick?: Function,
};

const MasterTable = (props: MasterTableProps) => {
    const classes = styles();

    const { title, fields, onError, onAddNew, onEdit, moreActions, onLoad, onRemove, onItemAction, onRowClick } = props;

    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState('');
    const [search, setSearch] = useState('');
    const [selectedData, setSelectedData] = useState([]);
    const [removeData, setRemoveData] = useState(null);

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

    const exportFile = (data, file) => {
        const link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('target', '_blank');
        link.setAttribute('download', file);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportCSV = async () => {
        setLoading(true);
        let csv = fields.map(field => FormatManager.buildCSV(field.label)).join(',') + '\n';

        selectedData.forEach(data => {
            csv +=
                fields
                    .map(field => {
                        const value = data[field.name];
                        if (typeof value === 'string') {
                            return FormatManager.buildCSV(value);
                        }
                        return FormatManager.buildCSV(JSON.stringify(value));
                    })
                    .join(',') + '\n';
        });

        const fileName = title.replace(/\s/g, '_') + '_' + FormatManager.formatDate(new Date(), 'YYYYMMDD_hhmmss') + '.csv';

        const blob = new Blob([decodeURIComponent(encodeURI(csv))], {
            type: 'text/csv;charset=UTF-8;header=present',
        });
        const downloadData = URL.createObjectURL(blob);
        exportFile(downloadData, fileName);
        setLoading(false);
    };

    const exportJson = async () => {
        setLoading(true);
        const json = JSON.stringify(selectedData);
        const fileName = title.replace(/\s/g, '_') + '_' + FormatManager.formatDate(new Date(), 'YYYYMMDD_hhmmss') + '.json';

        const blob = new Blob([decodeURIComponent(encodeURI(json))], {
            type: 'data:application/json;charset=UTF-8',
        });
        const downloadData = URL.createObjectURL(blob);

        exportFile(downloadData, fileName);
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

    useEffect(() => {
        loadData(0, paging.pageSize, paging.sort);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const handlePageChange = pagination => {
        loadData(pagination.page, pagination.pageSize, pagination.sort);
    };

    const handleSelectionChange = result => {
        setSelectedData(result);
    };

    const handleActionMenu = menuItem => {
        switch (menuItem.id) {
            case 'uncheck_all':
                setSelectedData([]);
                break;
            case 'export_csv':
                exportCSV();
                break;
            case 'export_json':
                exportJson();
                break;
            case 'remove':
                if (selectedData.length > 0) {
                    const ids = selectedData.map(item => item.id);
                    setQuestion('Are you sure to remove [' + ids.join(', ') + '] items?');
                    setRemoveData(selectedData);
                }
                break;
            default:
                console.log('invalid action');
                break;
        }
    };

    const handleDataAction = (item, data) => {
        if (item.id === 'edit') {
            onEdit(data);
        } else if (item.id === 'remove') {
            setQuestion('Are you sure to remove item : ' + data.id + ' ?');
            setRemoveData(data);
        } else if (onItemAction) {
            onItemAction(item, data);
        }
    };

    //Remove Data if confirmation is Yes
    const handleQuestionDialog = status => {
        if (status && removeData) {
            setLoading(true);
            onRemove(removeData)
                .then(data => {
                    setSelectedData([]);
                    loadData(0, paging.pageSize, paging.sort);
                })
                .catch(error => onError(error))
                .finally(() => setLoading(false));
        }
        setQuestion('');
        setRemoveData(null);
    };

    const actions = [
        ...moreActions,
        {
            id: 'edit',
            label: 'Edit',
            icon: 'edit',
        },
        {
            id: 'remove',
            label: 'Remove',
            icon: 'delete',
        },
    ];

    const fields_with_action = [
        ...fields,
        {
            name: 'data_actions',
            align: 'center',
            label: 'Actions',
            type: 'raw',
            onLoad: item => <DataAction onMenuItemClick={handleDataAction} actions={actions} data={item} />,
        },
    ];

    return (
        <>
            <LoadingDialog show={loading} />
            <QuestionDialog show={question.length > 0} title="Confirm?" message={question} onClose={handleQuestionDialog} />
            <Paper className={classes.root} elevation={6}>
                <Grid container className={classes.header}>
                    <Grid container item lg={3} md={4} sm={12} xs={12} justify="flex-start" alignContent="center">
                        <SearchInput className={classes.searchBox} onSearch={value => setSearch(value)} placeholder="Search Files" />
                    </Grid>
                    <Grid container item lg={6} md={4} sm={12} xs={12} alignItems="center" justify="center">
                        <Typography color="primary" variant="h6" component="h1" noWrap>
                            {title}
                        </Typography>
                    </Grid>
                    <Grid container item lg={3} md={4} sm={12} xs={12} alignContent="center" justify="flex-end">
                        <ActionMenu
                            onMenuItemClick={handleActionMenu}
                            disabled={!selectedData || selectedData.length < 1}
                            label={selectedData && selectedData.length > 0 ? 'Process ' + selectedData.length + ' Items.' : null}
                        />
                        <Button onClick={onAddNew} variant="contained" color="primary" aria-label="Add New" className={classes.newButton}>
                            <Icon>add</Icon>
                            New
                        </Button>
                    </Grid>
                </Grid>
                <Grid container item lg={12}>
                    <DataTable
                        multi={true}
                        items={paging.data}
                        fields={fields_with_action}
                        total={paging.total}
                        pageSize={paging.pageSize}
                        currentPage={paging.currentPage}
                        sort={paging.sort}
                        selectedData={selectedData}
                        onPageChange={handlePageChange}
                        onSelectionChange={handleSelectionChange}
                        onRowClick={onRowClick}
                    />
                </Grid>
            </Paper>
        </>
    );
};

MasterTable.defaultProps = {
    fields: [],
    title: 'Master Data',
    moreActions: [],
    onAddNew: () => console.warn('Undefined onAddNew'),
    onEdit: item => console.warn('Undefined onEdit => ', item),
    onError: error => console.warn('Undefined onError => ', error),
    onItemAction: item => console.warn('Undefined Item Action => ', item),
};

export default MasterTable;
