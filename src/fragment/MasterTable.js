import React, { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../config/Constant';
import { Typography, Paper, makeStyles, Grid, Icon, Button, useTheme } from '@material-ui/core';
import DataTable, { TableField } from './table';
import { QuestionDialog } from './message';
import { SearchInput } from './control';
import ActionMenu from './table/ActionMenu';
import DataAction from './table/DataAction';
import FormatManager from '../util/FormatManager';
import ImportMenu from './table/ImportMenu';
import { Field } from './MasterForm';
import { text, error } from '../config/Theme';
import { useDispatch } from 'react-redux';
import { ALERT_REDUX_ACTIONS } from '../util/AlertManager';

const styles = makeStyles(theme => ({
    header: {
        flex: 1,
        // backgroundColor:theme.palette.primary.main,
        borderBottom: '1px solid' + theme.palette.divider,
        padding: theme.spacing(1),
    },
    headerTitle: {
        marginLeft: theme.spacing(2),
        color: theme.palette.text.primary,
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

export type MasterTableProps = {
    fields: Array<TableField>,
    inputFields: Array<Field>,
    importFields: Array<string>,
    moreActions: Array<ActionProps>,
    title?: string,
    multi?: Boolean,
    onInputChange?: () => void,
    value?: Object,
    onSave?: () => void,
    onAddNew?: () => void,
    onEdit: (item: Object) => void,
    onLoad: (currentPage: number, pageSize: number, sort: string, search: string) => Promise<Any>,
    onRemove: (removeData: Object | Array) => Promise<Any>,
    onError: (error: Object | string) => void,
    onItemAction: (item: Object, data: Object) => void,
    onImport?: (data: Object | Any) => Promise<Any>,
    onRowClick?: () => void,
    type: 'TABLE' | 'INPUT',
    hideSearch?: Boolean,
    hideDataActions?: Boolean,
    hideActionMenu?: Boolean,
    hideImportMenu?: Boolean,
    hideCRUD?: Boolean,
    showCreate?: Boolean,
};

export const defaultActions = [
    {
        id: 'edit',
        label: 'Edit',
        icon: 'edit',
        color: text.primary,
    },
    {
        id: 'remove',
        label: 'Remove',
        icon: 'delete',
        color: error.main,
    },
];

const MasterTable = (props: MasterTableProps) => {
    const classes = styles();
    const theme = useTheme();
    const dispatch = useDispatch();

    const {
        multi,
        title,
        fields,
        inputFields,
        importFields,
        type,
        onInputChange,
        value,
        onSave,
        onError,
        onAddNew,
        onEdit,
        moreActions,
        onLoad,
        onRemove,
        onItemAction,
        onRowClick,
        onImport,
        hideSearch,
        hideDataActions,
        hideActionMenu,
        hideImportMenu,
        hideCRUD,
        showCreate,
    } = props;

    const [init, setInit] = useState(true);
    const [question, setQuestion] = useState('');
    const [search, setSearch] = useState('');
    const [selectedData, setSelectedData] = useState([]);
    const [removeData, setRemoveData] = useState(null);

    if (!hideDataActions && importFields.findIndex(f => f === 'version') < 0) {
        importFields.push('version');
    }

    const loadData = async (currentPage, pageSize, sort) => {
        dispatch({ type: ALERT_REDUX_ACTIONS.SHOW_LOADING });
        try {
            const result = await onLoad(currentPage, pageSize, sort, search);
            if (result) {
                setPaging(result);
                dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
            } else {
                onError({ message: 'There is no data.' });
            }
        } catch (error) {
            onError(error);
        }
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
        dispatch({ type: ALERT_REDUX_ACTIONS.SHOW_LOADING });
        let csv = importFields.map((field) => FormatManager.buildCSV(field)).join(',') + '\n';
        console.log('csv', selectedData);
        selectedData.forEach((data) => {
            csv +=
                importFields
                    .map((field) => {
                        let value = data[field] || '';
                        if (typeof data[field] === 'boolean') value = data[field];

                        if (typeof value === 'string' || typeof value === 'boolean') {
                            return FormatManager.buildCSV(value);
                        } else if (typeof value === 'object') {
                            if (value.id) {
                                return FormatManager.buildCSV(JSON.stringify({ id: value.id }));
                            }
                        }

                        return FormatManager.buildCSV(JSON.stringify(value));
                    })
                    .join(',') + '\n';
        });

        const fileName = FormatManager.readableToSnake(title) + '_' + FormatManager.formatDate(new Date(), 'yyyyMMdd_HHmmss') + '.csv';

        const blob = new Blob([decodeURIComponent(encodeURI(csv))], {
            type: 'text/csv;charset=UTF-8;header=present',
        });
        const downloadData = URL.createObjectURL(blob);
        exportFile(downloadData, fileName);
        dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
    };

    const exportJson = async () => {
        dispatch({ type: ALERT_REDUX_ACTIONS.SHOW_LOADING });
        const json = JSON.stringify(selectedData);
        const fileName = FormatManager.readableToSnake(title) + '_' + FormatManager.formatDate(new Date(), 'yyyyMMdd_HHmmss') + '.json';

        const blob = new Blob([decodeURIComponent(encodeURI(json))], {
            type: 'data:application/json;charset=UTF-8',
        });
        const downloadData = URL.createObjectURL(blob);

        exportFile(downloadData, fileName);
        dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
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
        async function initData() {
            const tableData = await localStorage.getItem(`${STORAGE_KEYS.TABLE_SESSION}.${FormatManager.readableToSnake(title)}`);
            
            const tableJson = JSON.parse(tableData);
            
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
        if (!init) {
            loadData(paging.currentPage, paging.pageSize, paging.sort);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    useEffect(() => {
        handleTableSession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedData, paging]);

    const handleTableSession = () => {
        localStorage.setItem(
            `${STORAGE_KEYS.TABLE_SESSION}.${FormatManager.readableToSnake(title)}`,
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

    const handleImport = (data) => {
        dispatch({ type: ALERT_REDUX_ACTIONS.SHOW_LOADING });
        if (onImport) {
            onImport(data)
                .then(() => {
                    loadData(0, paging.pageSize, paging.sort);
                    dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
                })
                .catch(onError);
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
    const handleQuestionDialog = (status) => {
        if (status && removeData) {
            dispatch({ type: ALERT_REDUX_ACTIONS.SHOW_LOADING });
            onRemove(removeData)
                .then((data) => {
                    setSelectedData([]);
                    loadData(0, paging.pageSize, paging.sort);
                    dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
                })
                .catch((error) => onError(error));
        }
        setQuestion('');
        setRemoveData(null);
    };

    const actions = [...moreActions, ...(hideCRUD ? [] : defaultActions)];

    const actionFields = {
        name: 'data_actions',
        align: 'center',
        label: '@',
        minWidth: 50,
        type: 'raw',
        onLoad: item => <DataAction onMenuItemClick={handleDataAction} actions={actions} data={item} />,
    };
    let fields_with_action = [];
    if (actions.length > 0) {
        fields_with_action = [actionFields];
    }
    fields_with_action = [...fields_with_action, ...fields];

    return (
        <>
            <QuestionDialog show={question.length > 0} title="Confirm?" message={question} onClose={handleQuestionDialog} />
            <Paper className={classes.root} elevation={6}>
                <Grid container className={classes.header}>
                    <Grid container item lg={4} md={4} sm={6} xs={12} justifyContent="flex-start" alignContent="center" alignItems="center">
                        <Typography className={classes.headerTitle} variant="h6" component="h1" noWrap>
                            {title}
                        </Typography>
                    </Grid>
                    <Grid container item lg={4} md={4} sm={6} xs={12} alignItems="center" alignContent="center" justifyContent="center">
                        {hideSearch || <SearchInput value={search} onSearch={value => setSearch(value)} placeholder="Search Files" />}
                    </Grid>
                    <Grid container item lg={4} md={4} sm={12} xs={12} alignContent="center" justifyContent="flex-end">
                        {hideDataActions || (
                            <>
                                {hideActionMenu || (
                                    <ActionMenu
                                        onMenuItemClick={handleActionMenu}
                                        disabled={!selectedData || selectedData.length < 1}
                                        label={selectedData && selectedData.length > 0 ? selectedData.length + ' Items.' : null}
                                    />
                                )}
                                {hideImportMenu || <ImportMenu fields={importFields} onImportItems={handleImport} className={classes.newButton} />}
                            </>
                        )}
                        {showCreate && (
                            <Button onClick={onAddNew} variant="contained" color="primary" aria-label="Add New" className={classes.newButton}>
                                <Icon>add</Icon>
                                New
                            </Button>
                        )}
                    </Grid>
                </Grid>
                <Grid container item lg={12}>
                    <DataTable
                        multi={multi}
                        type={type}
                        items={paging.data}
                        fields={fields_with_action}
                        inputFields={inputFields}
                        onInputChange={onInputChange}
                        value={value}
                        onSave={onSave}
                        onEdit={onEdit}
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
    multi: true,
    hideSearch: false,
    hideCRUD: false,
    hideDataActions: false,
    hideActionMenu: false,
    hideImportMenu: false,
    showCreate: true,
    type: 'TABLE',
    onAddNew: () => console.warn('Undefined onAddNew'),
    onEdit: item => console.warn('Undefined onEdit => ', item),
    onError: error => console.warn('Undefined onError => ', error),
    onItemAction: item => console.warn('Undefined Item Action => ', item),
};

export default MasterTable;
