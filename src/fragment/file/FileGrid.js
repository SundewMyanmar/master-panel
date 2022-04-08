/* @flow */
import React from 'react';
import { Grid, CardActionArea, Card, CardMedia, CardContent, Typography, makeStyles } from '@material-ui/core';
import FileApi from '../../api/FileApi';
import type { GridProps } from '@material-ui/core';

const itemStyles = makeStyles((theme) => ({
    root: (props) => ({
        width: '100%',
        cursor: 'pointer',
        margin: theme.spacing(1),
        border: '1px solid ' + (props.selected ? theme.palette.primary.main : theme.palette.divider),
        backgroundColor: theme.palette.background.paper,
    }),
    title: {
        padding: theme.spacing(0.5, 0),
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    media: (props) => ({
        paddingTop: '75%', // 16:9
        borderBottom: '1px solid ' + (props.selected ? theme.palette.primary.main : theme.palette.divider),
    }),
    info: (props) => ({
        padding: theme.spacing(0.5, 1),
        color: props.selected ? theme.palette.primary.contrastText : theme.palette.secondary.contrastText,
        backgroundColor: props.selected ? theme.palette.primary.main : theme.palette.secondary.main,
    }),
    markedIcon: {
        position: 'absolute',
        fontSize: 28,
        top: 0,
        right: 0,
    },
}));

export interface FileGridItemProps {
    onClick: () => void;
    multi: boolean;
    isMarked: boolean;
    name: string;
    extension: string;
    size: string;
    type: string;
}

export const FileGridItem = (props: FileGridItemProps) => {
    const { onClick, multi, isMarked, ...item } = props;
    const classes = itemStyles({ selected: isMarked });
    const isImage = item.type.startsWith('image');
    const url = item.type.startsWith('image') ? FileApi.downloadLink(item, 'small') : '/images/file.png';

    return (
        <Grid container item justifyContent="center" xs={6} sm={4} md={3} lg={2}>
            <Card className={classes.root} elevation={3}>
                <CardActionArea onClick={onClick}>
                    <CardMedia className={classes.media} image={url} title={item.name ? item.name : 'No Image'} />
                    {url && isImage ? <img src={url} alt={item.name} style={{ display: 'none' }} /> : null}
                    <CardContent style={isMarked ? { position: 'relative' } : null} className={classes.info}>
                        <Typography className={classes.title} variant="subtitle2" align="center">
                            {item.name + '.' + item.extension}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    );
};

export interface FileGridProps extends GridProps {
    data: Array<Object>;
    selectedData: Array<Object>;
    multi: boolean;
    onClickItem?: (file: object) => void;
}

const FileGrid = (props: FileGridProps) => {
    const { data, selectedData, multi, onClickItem, ...gridProps } = props;

    return (
        <Grid container {...gridProps}>
            {data && data.length > 0 ? (
                data.map((item, index) => {
                    const isMarked = multi
                        ? selectedData.findIndex((x) => x.id === item.id) >= 0
                        : selectedData && selectedData.id && selectedData.id === item.id;

                    let itemResult = (
                        <FileGridItem multi={multi} isMarked={isMarked} key={item.id + '-' + index} onClick={() => onClickItem(item)} {...item} />
                    );

                    return itemResult;
                })
            ) : (
                <Grid item>
                    <Typography variant="body2">There is no file.</Typography>
                </Grid>
            )}
        </Grid>
    );
};

FileGrid.defaultProps = {
    data: [],
    multi: false,
    onClickItem: (file) => console.warn('Undefined onSelectionChange => ', file),
};

export default FileGrid;
