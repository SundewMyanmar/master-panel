import React from 'react';
import { TableCell, TableCellBaseProps, Icon } from '@material-ui/core';
import { TableField } from '.';
import FileApi from '../../api/FileApi';
import LangManager from '../../util/LangManager';

export type CellProps = {
    ...TableCellBaseProps,
    type: 'text' | 'image' | 'icon' | 'bool' | 'raw',
    field: TableField,
    data: Object,
};

export const ImageCell = (field, data) => {
    const { name, align, label, type, sortable, hidden, minWidth, onLoad, ...imageProps } = field;

    let image = data[name] || './images/default-image.png';
    let alt = field.name + '-image';
    if (onLoad) {
        image = onLoad(data);
    } else if (typeof image === 'object' && image.id) {
        image = FileApi.downloadLink(data[field.name]);
    }

    return <img alt={alt} width={40} src={image} {...imageProps} />;
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

    return <Icon color={checked ? 'primary' : 'error'}>{checked ? 'check' : 'close'}</Icon>;
};

const Cell = (props: CellProps) => {
    const { field, data, ...cellProps } = props;
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
            cellValue = field.onLoad(data);
            break;
        default:
            cellValue = field.onLoad ? field.onLoad(data) : LangManager.translateToUni(data[field.name]);
            break;
    }

    return (
        <TableCell align={field.align} style={field.minWidth ? { minWidth: field.minWidth } : null} {...cellProps}>
            {cellValue || '-'}
        </TableCell>
    );
};

Cell.defaultProps = {
    type: 'text',
};

export default Cell;
