import React, { useState, useEffect, Component } from 'react';
import {
    Table,
    TableBaseProps,
    TableHead,
    TableRow,
    TableBody,
    TableFooter,
    makeStyles,
    TableCell,
    TableContainer,
    Checkbox,
    IconButton,
    Icon,
} from '@material-ui/core';
import {
    TextInput,
    EmailInput,
    PasswordInput,
    NumberInput,
    ImageInput,
    CheckboxInput,
    ListInput,
    ObjectInput,
    IconInput,
    ChipInput,
    ColorInput,
    TabControl,
} from '../control';
import Cell from './Cell';
import PaginationBar from '../PaginationBar';
import { HeaderCell } from './HeaderCell';

export type TableField = {
    name: string,
    type: 'text' | 'image' | 'icon' | 'bool' | 'raw',
    align: 'left' | 'center' | 'right',
    label: string,
    minWidth: number,
    sortable: ?boolean,
    hidden: ?boolean,
    onLoad?: (item: Object) => Component | string,
};

export type DataTableProps = {
    ...TableBaseProps,
    fields: Array<Object>,
    inputFields: Array<Object>,
    items: Array<Object>,
    selectedData?: Array<Object> | Object,
    total?: number,
    pageSize?: number,
    currentPage?: number,
    sort?: string,
    multi?: boolean,
    noData?: string,
    disablePaging?: boolean,
    type: 'TABLE' | 'INPUT',
    onPageChange?: (page: number) => void,
    onRowClick?: (item: Object) => void,
    onSelectionChange?: (result: Object | Array<Object>) => void,
    onError?: (error: Object | string) => void,
};

const styles = makeStyles((theme) => ({
    root: {
        flex: 1,
    },
    tableHead: {
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderBottom: theme.palette.divider,
    },
    tableBody: {
        background: theme.palette.background.default,
        borderBottom: theme.palette.primary.dark,
    },
    inputTableRow: {
        backgroundColor: 'inherit',
        // height: 100,
        margin: 0,
    },
    tableFooter: {
        padding: theme.spacing(1),
    },
    footerRow: {
        backgroundColor: theme.palette.background.paper,
    },
}));

const SelectionCheckbox = makeStyles((theme) => ({
    root: {
        color: theme.palette.primary.contrastText,
        '&$checked': {
            color: theme.palette.primary.light,
        },
        '&$indeterminate': {
            color: theme.palette.primary.light,
        },
    },
    checked: {},
    indeterminate: {},
}));

const DataTable = (props: DataTableProps) => {
    const classes = styles();
    const {
        multi,
        selectedData,
        fields,
        inputFields,
        value,
        items,
        total,
        pageSize,
        currentPage,
        sort,
        noData,
        disablePaging,
        type,
        onSave,
        onInputChange,
        onPageChange,
        onRowClick,
        onSelectionChange,
        ...tableProps
    } = props;
    const [rootState, setRootState] = useState('unchecked');

    useEffect(() => {
        if (!multi) {
            return;
        }

        if (!selectedData || selectedData.length <= 0 || !items || items.length <= 0) {
            setRootState('unchecked');
            return;
        }

        let found = 0;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (!item) {
                continue;
            }
            const existIdx = selectedData.findIndex((x) => x.id === item.id);
            if (existIdx >= 0) {
                found++;
            }
        }

        if (found > 0) {
            setRootState(found === items.length ? 'checked' : 'indeterminate');
        } else {
            setRootState('unchecked');
        }
        // eslint-disable-next-line
    }, [items, selectedData]);

    const handleRootClick = (event) => {
        if (!multi) {
            return;
        }
        let updateSelection = selectedData.filter((x) => items.findIndex((item) => item.id === x.id) < 0);
        if (event.target.checked) {
            updateSelection = [...updateSelection, ...items];
        }
        onSelectionChange(updateSelection);
    };

    const handleCheck = (item) => {
        if (!multi) {
            onSelectionChange(item);
            return;
        }

        const existIdx = selectedData.findIndex((x) => x.id === item.id);
        const updateSelection = existIdx < 0 ? [...selectedData, item] : selectedData.filter((x) => x.id !== item.id);

        onSelectionChange(updateSelection);
    };

    const handlePageChange = (page) => {
        onPageChange({
            page: page,
            pageSize: pageSize,
            sort: sort,
        });
    };

    const handlePageSizeChange = (pageSize) => {
        onPageChange({
            page: 0,
            pageSize: pageSize,
            sort: sort,
        });
    };

    const handleSortChange = (sortString) => {
        onPageChange({
            page: currentPage,
            pageSize: pageSize,
            sort: sortString,
        });
    };

    const handleValueChange = (field, event) => {
        if (onInputChange) {
            onInputChange(event);
        }
    };

    const handleSave = () => {
        if (onSave) {
            onSave(value);
        }
    };

    const handleKeyDown = (evt) => {
        if (['Enter', 'Tab', ','].includes(evt.key)) {
            evt.preventDefault();
            if (onSave) {
                onSave();
            }
        }
    };

    const renderControl = (type, inputProps) => {
        inputProps = { ...inputProps, height: 30, variant: 'standard', display: 'simple', style: { margin: 0 } };
        switch (type) {
            case 'email':
                return <EmailInput {...inputProps} />;
            case 'password':
                return <PasswordInput {...inputProps} />;
            case 'number':
                return <NumberInput {...inputProps} />;
            case 'datetime':
                return <TextInput type="datetime-local" {...inputProps} />;
            case 'date':
                return <TextInput type="date" {...inputProps} />;
            case 'time':
                return <TextInput type="time" {...inputProps} />;
            case 'checkbox':
                return <CheckboxInput {...inputProps} />;
            case 'image':
                return <ImageInput size={{ width: 30, height: 30 }} {...inputProps} />;
            // case 'multi-image': {
            //     return <MultiImagePicker {...inputProps} />;
            // }
            case 'icon':
                return <IconInput {...inputProps} />;
            case 'file':
                return <ImageInput size={{ width: 30, height: 30 }} {...inputProps} />;
            case 'list':
                return <ListInput {...inputProps} />;
            case 'table':
                return <ObjectInput {...inputProps} />;
            case 'chip':
                return <ChipInput {...inputProps} />;
            case 'color':
                return <ColorInput {...inputProps} />;
            default:
                return <TextInput type={type} {...inputProps} />;
        }
    };

    const renderTableInput = () => {
        if (type == 'INPUT') {
            return (
                <TableRow className={classes.inputTableRow}>
                    {multi ? <TableCell></TableCell> : null}
                    {inputFields.map((field, index) => {
                        const { type, ...inputProps } = field;
                        if (!type || field.id == 'id' || field.name == 'id') {
                            return <TableCell key={`ip-cell-${index}`}></TableCell>;
                        }
                        inputProps.key = field.id + '_' + index;
                        inputProps.name = field.name || field.id;
                        inputProps.onChange = (event) => handleValueChange(field, event);
                        if (index == inputFields.length - 1) {
                            inputProps.onKeyDown = handleKeyDown;
                        }
                        return (
                            <TableCell style={{ backgroundColor: 'inherit' }} key={`ip-cell-${inputProps.key}`}>
                                {renderControl(type, inputProps)}
                            </TableCell>
                        );
                    })}
                    <TableCell>
                        <IconButton onClick={handleSave} style={{ marginTop: 6 }}>
                            <Icon color="primary">input</Icon>
                        </IconButton>
                    </TableCell>
                </TableRow>
            );
        }
        return <></>;
    };

    return (
        <TableContainer>
            <Table size={multi ? 'small' : 'medium'} className={classes.root} {...tableProps}>
                <TableHead className={classes.tableHead}>
                    <TableRow>
                        {multi ? (
                            <TableCell align="center" style={{ width: 64 }}>
                                <Checkbox
                                    classes={SelectionCheckbox()}
                                    indeterminate={rootState === 'indeterminate'}
                                    checked={rootState === 'checked'}
                                    value="root"
                                    color="primary"
                                    onChange={handleRootClick}
                                />
                            </TableCell>
                        ) : null}
                        {fields.map((field, index) => (
                            <HeaderCell key={field.name + '-' + index} sort={sort} onSortChange={handleSortChange} field={field} />
                        ))}
                        {type == 'INPUT' ? <TableCell></TableCell> : null}
                    </TableRow>
                </TableHead>
                <TableBody className={classes.tableBody}>
                    {renderTableInput()}
                    {items && items.length > 0 ? (
                        items.map((row, dataIdx) => {
                            let pointerStyle = {
                                cursor: 'pointer',
                            };

                            const marked = multi
                                ? selectedData.findIndex((x) => x.id === row.id) >= 0
                                : selectedData && selectedData.id && row.id === selectedData.id;

                            return (
                                <TableRow
                                    selected={marked}
                                    style={onRowClick ? pointerStyle : null}
                                    key={row.id + '-' + dataIdx}
                                    index={dataIdx}
                                    onClick={() => {
                                        if (onRowClick) onRowClick(row);
                                    }}
                                    hover={true}
                                >
                                    {multi ? (
                                        <TableCell align="center" style={{ maxWidth: 64 }}>
                                            <Checkbox checked={marked} onChange={() => handleCheck(row)} value={row.id || dataIdx} color="primary" />
                                        </TableCell>
                                    ) : null}
                                    {fields.map((field, index) => (
                                        <Cell key={field.name + '-' + index} rowIndex={dataIdx} field={field} data={row} />
                                    ))}
                                    {type == 'INPUT' ? <TableCell></TableCell> : null}
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell size="medium" colSpan={multi ? fields.length + 1 : fields.length}>
                                {noData}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                {disablePaging ? null : (
                    <TableFooter className={classes.tableFooter}>
                        <TableRow>
                            <PaginationBar
                                className={classes.footerRow}
                                colSpan={multi ? fields.length + 1 : fields.length}
                                total={total}
                                pageSize={pageSize}
                                currentPage={currentPage}
                                onPageSizeChange={handlePageSizeChange}
                                onPageChange={handlePageChange}
                            />
                        </TableRow>
                    </TableFooter>
                )}
            </Table>
        </TableContainer>
    );
};

DataTable.defaultProps = {
    multi: false,
    selectedData: {},
    items: [],
    total: 0,
    pageSize: 10,
    currentPage: 1,
    sort: 'id:Desc',
    noData: 'There is no data.',
    disablePaging: false,
    onPageChange: (newPaged) => console.warn('Undefined onPageChange => ', newPaged),
    onSelectionChange: (result) => console.warn('Undefined onSelectionChange => ', result),
};

export default DataTable;
