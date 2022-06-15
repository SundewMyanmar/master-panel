import React from 'react';
import { TableCell, Icon, useTheme, ThemeProvider } from '@material-ui/core';
import { TableField } from '.';
import FileApi from '../../api/FileApi';
import LangManager from '../../util/LangManager';
import type { TableCellProps } from '@material-ui/core';
import { ErrorTheme, InfoTheme, SuccessTheme } from '../../config/Theme';

export interface CellProps extends TableCellProps {
    type: 'text' | 'image' | 'icon' | 'color' | 'bool' | 'raw';
    field: TableField;
    rowIndex: int;
    data: object;
}

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

export const ColorCell = (field, data) => {
    const { name, onLoad } = field;
    const theme = useTheme();

    let color = data[name];
    if (onLoad) {
        color = onLoad(data);
    }

    if (!color) {
        return <></>;
    }

    return (
        <div
            style={{
                width: 40,
                height: 25,
                border: '1px solid ' + theme.palette.divider,
                borderRadius: 2,
                backgroundColor: color,
            }}
        ></div>
    );
};

export const IconCell = (field, data) => {
    const { name, onLoad } = field;

    let icon = data[name];
    if (onLoad) {
        icon = onLoad(data);
    }

    return <Icon style={{ padding: 0, margin: 0 }}>{icon}</Icon>;
};

export const BooleanCell = (field, data) => {
    const { name, onLoad } = field;

    let checked = data[name];
    if (onLoad) {
        checked = onLoad(data);
    }

    return (
        <ThemeProvider theme={SuccessTheme}>
            <Icon color={checked ? 'primary' : 'disabled'}>{checked ? 'check_circle' : 'check_circle_outline'}</Icon>
        </ThemeProvider>
    );
};

const Cell = (props: CellProps) => {
    const { field, data, rowIndex, ...cellProps } = props;
    let cellValue = 'None';
    if (field.hidden) {
        return null;
    }

    let cellPadding = 'normal';
    switch (field.type) {
        case 'image':
            cellValue = ImageCell(field, data);
            break;
        case 'color':
            cellValue = ColorCell(field, data);
            break;
        case 'icon':
            cellValue = IconCell(field, data);
            break;
        case 'bool':
            cellValue = BooleanCell(field, data);
            cellPadding = 'none';
            break;
        case 'raw':
            cellValue = field.onLoad(data, rowIndex);
            cellPadding = 'none';
            break;
        default:
            cellValue = field.onLoad ? field.onLoad(data, rowIndex) : Object.prototype.hasOwnProperty.call(data, field.name) ? data[field.name] : '-';
            break;
    }

    return (
        <TableCell
            padding={cellPadding}
            color="secondary"
            align={field.align}
            style={field.minWidth ? { minWidth: field.minWidth } : null}
            {...cellProps}
        >
            {cellValue || cellValue === 0 ? cellValue : '-'}
        </TableCell>
    );
};

Cell.defaultProps = {
    type: 'text',
};

export default Cell;
