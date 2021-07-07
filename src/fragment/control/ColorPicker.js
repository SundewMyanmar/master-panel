/* @flow */
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    Typography,
    Zoom,
    makeStyles,
    Icon,
    Tooltip,
    IconButton,
    Breadcrumbs,
    Link,
} from '@material-ui/core';
import { SwatchesPicker, SketchPicker } from 'react-color';
import { info } from '../../config/Theme';

type ColorPickerProps = {
    show: boolean,
    value: string,
    title?: string,
    onClose: (result: boolean | Object | Array<Object>) => void,
};

const DEFAULT_WIDTH = 560;
const DEFAULT_HEIGHT = 295;

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom in ref={ref} {...props} />;
});

const styles = makeStyles((theme) => ({
    content: {
        padding: 0,
        margin: 0,
    },
    body: {
        backgroundColor: theme.palette.background.default,
        borderTop: '1px solid ' + theme.palette.divider,
        borderBottom: '1px solid ' + theme.palette.divider,
        padding: 0,
        margin: 0,
        overflowY: 'hidden',
    },
    header: {
        padding: theme.spacing(1, 2),
    },
    noLoading: {
        height: 4,
        display: 'block',
    },
    titleText: {
        color: theme.palette.text.primary,
    },
}));

const ColorPicker = (props: ColorPickerProps) => {
    const classes = styles();
    const { title, value, show, onClose } = props;
    const [color, setColor] = React.useState('#fff');
    const [type, setType] = React.useState('SWATCH');

    React.useEffect(() => {
        if (value) setColor(value);
    }, [value, show]);

    const handleChange = (newColor) => {
        setColor(newColor);

        if (onClose) onClose(newColor.hex);
    };

    const handleChangeComplete = (newColor) => {
        setColor(newColor);
    };

    const handleClose = () => {
        if (onClose) {
            onClose(color && color.hex ? color.hex : '');
        }
    };

    return (
        <>
            <Dialog onClose={() => onClose(false)} open={show} TransitionComponent={Transition}>
                <DialogTitle className={classes.header}>
                    <Grid container>
                        <Grid container item lg={8} md={8} sm={8} xs={12} alignItems="center" justifyContent="flex-start">
                            <Typography className={classes.titleText} variant="h6" component="h1" noWrap>
                                {title}
                            </Typography>
                        </Grid>

                        <Grid container item lg={4} md={4} sm={4} xs={12} alignItems="center" justifyContent="flex-end">
                            <Tooltip title="Close Dialog">
                                <IconButton size="small" className={classes.titleText} onClick={() => handleClose()} aria-label="Close">
                                    <Icon>close</Icon>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent className={classes.body}>
                    <Breadcrumbs style={{ padding: 12 }} aria-label="breadcrumb">
                        <Link
                            style={{
                                cursor: 'pointer',
                                backgroundColor: type == 'SKETCH' ? 'inherit' : info.light,
                                padding: 3,
                                borderRadius: 2,
                            }}
                            color="inherit"
                            onClick={() => setType('SWATCH')}
                        >
                            Material
                        </Link>
                        <Link
                            style={{
                                cursor: 'pointer',
                                backgroundColor: type == 'SKETCH' ? info.light : 'inherit',
                                padding: 3,
                                borderRadius: 2,
                            }}
                            color="inherit"
                            onClick={() => setType('SKETCH')}
                        >
                            Custom
                        </Link>
                    </Breadcrumbs>
                    <Grid className={classes.content} container justifyContent="center">
                        {type == 'SKETCH' ? (
                            <SketchPicker width={DEFAULT_WIDTH} color={color} onChangeComplete={handleChangeComplete} />
                        ) : (
                            <SwatchesPicker width={DEFAULT_WIDTH} height={DEFAULT_HEIGHT} onChange={handleChange} />
                        )}
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
};

ColorPicker.defaultProps = {
    title: 'Color Browser',
    value: '#fff',
    onError: (error) => console.warn(error),
};

export default ColorPicker;
