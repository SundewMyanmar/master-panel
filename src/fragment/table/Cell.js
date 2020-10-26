import React from 'react';
import { TableCell, TableCellBaseProps, Icon } from '@material-ui/core';
import { TableField } from '.';
import FileApi from '../../api/FileApi';
import LangManager from '../../util/LangManager';

export type CellProps = {
    ...TableCellBaseProps,
    type: 'text' | 'image' | 'icon' | 'bool' | 'raw',
    field: TableField,
    rowIndex: int,
    data: Object,
};

export const ImageCell = (field, data) => {
    const { name, align, label, type, sortable, hidden, filterable, minWidth, onLoad, ...imageProps } = field;

    let image = data[name];
    let alt = field.name + '-image';
    if (onLoad) {
        image = onLoad(data);
    } else if (image && typeof image === 'object' && image.id) {
        image = FileApi.downloadLink(data[field.name], 'thumb');
    } else if (image) {
        image = image.url;
    }
    return <img alt={alt} width={30} style={{ marginTop: 3 }} src={image || `../../${'images/default-image.png'}`} {...imageProps} />;
};

export const IconCell = (field, data) => {
    const { name, onLoad } = field;

    let icon = data[name];
    if (onLoad) {
        icon = onLoad(data);
    }

    return <Icon color="primary">{icon}</Icon>;
};

export const BooleanCell = (field, data) => {
    const { name, onLoad } = field;

    let checked = data[name];
    if (onLoad) {
        checked = onLoad(data);
    }

    return <Icon color={checked ? 'textPrimary' : 'error'}>{checked ? 'check' : 'close'}</Icon>;
};

const Cell = (props: CellProps) => {
    const { field, data, rowIndex, ...cellProps } = props;
    let cellValue = 'None';

    if (field.hidden) {
        return null;
    }

    switch (field.type) {
        case 'image':
            cellValue = ImageCell(field, data);
            break;
        case 'icon':
            cellValue = IconCell(field, data);
            break;
        case 'bool':
            cellValue = BooleanCell(field, data);
            break;
        case 'raw':
            cellValue = field.onLoad(data, rowIndex);
            break;
        default:
            cellValue = field.onLoad
                ? LangManager.translateToUni(field.onLoad(data, rowIndex))
                : LangManager.translateToUni(data[field.name], rowIndex);
            break;
    }

    return (
        <TableCell color="secondary" align={field.align} style={field.minWidth ? { minWidth: field.minWidth } : null} {...cellProps}>
            {cellValue || '-'}
        </TableCell>
    );
};

Cell.defaultProps = {
    type: 'text',
};

export default Cell;
