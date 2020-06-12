import React, { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../config/Constant';
import { Typography, Paper, makeStyles, Grid, Icon, Button } from '@material-ui/core';
import DataTable, { TableField } from './table';
import { QuestionDialog, LoadingDialog } from './message';
import { SearchInput } from './control';
import ActionMenu from './table/ActionMenu';
import DataAction from './table/DataAction';
import FormatManager from '../util/FormatManager';
import ImportMenu from './table/ImportMenu';

const styles = makeStyles(theme => ({
    header: {
        flex: 1,
        // backgroundColor:theme.palette.primary.main,
        borderBottom: '1px solid' + theme.palette.divider,
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
    currentPage: number,
    pageSize: number,
    total: number,
    data: Array<Object>,
    sort: string,
};

export type ActionProps = {
    id: string,
    label: string,
    icon: string,
};

type MasterTableProps = {
    fields: Array<TableField>,
    importFields: Array<string>,
    moreActions: Array<ActionProps>,
    title?: string,
    onAddNew?: Function,
    onEdit(item: Object): ?Function,
    onLoad(currentPage: number, pageSize: number, sort: string, search: string): (?Function) => Promise<Any>,
    onRemove(removeData: Object | Array): (?Function) => Promise<Any>,
    onError(error: Object | string): ?Function,
    onItemAction(item: Object, data: Object): ?Function,
    onImport?: data => Promise<Any>,
    onRowClick?: Function,
};

const MasterTable = (props: MasterTableProps) => {
    const classes = styles();

    const { title, fields, importFields, onError, onAddNew, onEdit, moreActions, onLoad, onRemove, onItemAction, onRowClick, onImport } = props;

    const [init, setInit] = useState(true);
    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState('');
    const [search, setSearch] = useState('');
    const [selectedData, setSelectedData] = useState([]);
    const [removeData, setRemoveData] = useState(null);

    if (importFields.findIndex(f => f === 'version') < 0) {
        importFields.push('version');
    }

    const loadData = async (currentPage, pageSize, sort) => {
        setLoading(true);
        try {
            const result = await onLoad(currentPage, pageSize, sort, search);
            console.log('handel Master Table', result);
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
        let csv = importFields.map(field => FormatManager.buildCSV(field)).join(',') + '\n';

        selectedData.forEach(data => {
            csv +=
                importFields
                    .map(field => {
                        const value = data[field] || '';
                        if (typeof value === 'string') {
                            return FormatManager.buildCSV(value);
                        }
                        return FormatManager.buildCSV(JSON.stringify(value));
                    })
                    .join(',') + '\n';
        });

        const fileName = FormatManager.readableToSnake(title) + '_' + FormatManager.formatDate(new Date(), 'YYYYMMDD_hhmmss') + '.csv';

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
        const fileName = FormatManager.readableToSnake(title) + '_' + FormatManager.formatDate(new Date(), 'YYYYMMDD_hhmmss') + '.json';

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
            pageSize: 5,
            total: 0,
            data: [],
            sort: 'id:ASC',
        };
    });

    useEffect(() => {
        async function initData() {
            const tableData = await localStorage.getItem(`${STORAGE_KEYS.TABLE_SESSION}.${FormatManager.readableToSnake(title)}`);
            const tableJson = JSON.parse(tableData);
            console.log('paging', tableJson);
            setInit(false);
            if (tableJson && tableJson.paging.data && tableJson.paging.data.length > 0) {
                loadData(tableJson.paging.currentPage, tableJson.paging.pageSize, tableJson.paging.sort);
                setSelectedData(tableJson.selectedData);
                setSearch(tableJson.search);
            } else {
                loadData(0, paging.pageSize, paging.sort);
            }
        }

        initData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        handleTableSession();
        console.log('search', paging, search, init);
        if (!init) {
            console.log('win');
            loadData(paging.currentPage, paging.pageSize, paging.sort);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    useEffect(() => {
        handleTableSession();
        console.log('selected,paging');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedData, paging]);

    const handleTableSession = () => {
        localStorage.setItem(
            `${STORAGE_KEYS.TABLE_SESSION}.${title}`,
            JSON.stringify({
                paging: paging,
                selectedData: selectedData,
                search: search,
            }),
        );
    };

    const handlePageChange = pagination => {
        loadData(pagination.page, pagination.pageSize, pagination.sort);
    };

    const handleImport = data => {
        setLoading(true);
        if (onImport) {
            onImport(data)
                .then(() => {
                    loadData(0, paging.pageSize, paging.sort);
                })
                .catch(onError)
                .finally(() => setLoading(false));
        }
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
        {
            name: 'data_actions',
            align: 'center',
            label: '@',
            minWidth: 50,
            type: 'raw',
            onLoad: item => <DataAction onMenuItemClick={handleDataAction} actions={actions} data={item} />,
        },
        ...fields,
    ];

    return (
        <>
            <LoadingDialog show={loading} />
            <QuestionDialog show={question.length > 0} title="Confirm?" message={question} onClose={handleQuestionDialog} />
            <Paper className={classes.root} elevation={6}>
                <Grid container className={classes.header}>
                    <Grid container item lg={4} md={4} sm={6} xs={12} justify="flex-start" alignContent="center" alignItems="center">
                        <Typography color="primary" variant="h6" component="h1" noWrap>
                            {title}
                        </Typography>
                    </Grid>
                    <Grid container item lg={4} md={4} sm={6} xs={12} alignItems="center" alignContent="center" justify="center">
                        <SearchInput value={search} onSearch={value => setSearch(value)} placeholder="Search Files" />
                    </Grid>
                    <Grid container item lg={4} md={4} sm={12} xs={12} alignContent="center" justify="flex-end">
                        <ActionMenu
                            onMenuItemClick={handleActionMenu}
                            disabled={!selectedData || selectedData.length < 1}
                            label={selectedData && selectedData.length > 0 ? selectedData.length + ' Items.' : null}
                        />
                        <ImportMenu fields={importFields} onImportItems={handleImport} className={classes.newButton} />
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
