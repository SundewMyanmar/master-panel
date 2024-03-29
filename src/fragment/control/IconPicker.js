/* @flow */
import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    Typography,
    Zoom,
    makeStyles,
    Icon,
    DialogActions,
    Button,
    Tooltip,
    IconButton,
    Paper,
} from '@material-ui/core';
import SearchInput from './SearchInput';
import { MATERIAL_ICONS } from '../../config/MaterialIcon';
import type { DialogProps } from '@material-ui/core';

export interface IconPickerProps extends DialogProps {
    show: boolean;
    selectedData: Array<string> | string;
    multi: boolean;
    title?: string;
    onClose: (result: boolean | Object | Array<Object>) => void;
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom in ref={ref} {...props} />;
});

const itemStyles = makeStyles((theme) => ({
    root: {
        // ...theme.mixins.gutters(),
        borderRadius: 0,
        display: 'block',
    },
    title: {
        textAlign: 'center',
        padding: theme.spacing(1),
        fontSize: 16,
        fontWeight: 800,
        color: theme.palette.text.primary,
    },
    iconButton: {
        cursor: 'pointer',
        padding: theme.spacing(1),
        margin: theme.spacing(0.5),
        width: 100,
        textAlign: 'center',
        background: theme.palette.background.paper,
        color: theme.palette.primary.main,
        '&:hover': {
            background: theme.palette.primary.light,
        },
    },
    closeButton: {
        color: theme.palette.text.primary,
    },
    markedIconButton: {
        cursor: 'pointer',
        padding: theme.spacing(1),
        margin: theme.spacing(0.5),
        width: 100,
        textAlign: 'center',
        background: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
        '&:hover': {
            background: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
        },
    },
    buttonIcon: {
        color: theme.palette.text.primary,
    },
    buttonCaption: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: 11,
        color: theme.palette.text.primary,
    },
}));

const IconDisplay = (props) => {
    const classes = itemStyles();
    const { onIconClick, selectedData, filter, multi, icons, id, name } = props;

    if (!icons || icons.length <= 0) {
        return null;
    }

    let filterIcons = icons;

    if (filter.length > 0) {
        filterIcons = icons.filter((icon) => icon.name.toLowerCase().search(filter.toLowerCase()) !== -1);
    }

    if (filterIcons.length <= 0) {
        return null;
    }

    return (
        <div className={classes.root}>
            <div className={classes.title}>
                <Typography variant="caption">{name.toUpperCase()}</Typography>
            </div>
            <Grid container item justifyContent="center" alignItems="center" alignContent="center" xs={12} sm={12} md={12} lg={12}>
                {filterIcons.map((icon, idx) => {
                    if (icon.name.toLowerCase().search(filter.toLowerCase()) === -1) {
                        return null;
                    }

                    const isMarked = multi ? selectedData.findIndex((x) => x === icon.ligature) >= 0 : selectedData === icon.ligature;
                    return (
                        <Paper
                            className={isMarked ? classes.markedIconButton : classes.iconButton}
                            onClick={() => onIconClick(icon)}
                            key={id + '_' + idx}
                            aria-label="Icon"
                        >
                            <div>
                                <Icon fontSize="large" className={classes.buttonIcon}>
                                    {icon.ligature}
                                </Icon>
                            </div>
                            <div className={classes.buttonCaption}>{icon.ligature}</div>
                        </Paper>
                    );
                })}
            </Grid>
        </div>
    );
};

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
    },
    header: {
        padding: theme.spacing(1, 2),
    },
    noLoading: {
        height: 4,
        display: 'block',
    },
}));

const IconPicker = (props: IconPickerProps) => {
    const classes = styles();
    const { title, multi, selectedData, show, onClose, ...rest } = props;
    const [checked, setChecked] = useState(selectedData);
    const [search, setSearch] = useState('');

    //Set value if props.value changed.
    React.useEffect(() => {
        if (show) {
            setChecked(selectedData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedData, show]);

    const handleClick = (item) => {
        if (!multi) {
            onClose(item.ligature);
            return;
        }
        const existIdx = checked.findIndex((x) => x === item.ligature);
        const updateSelection = existIdx < 0 ? [...checked, item.ligature] : checked.filter((x) => x !== item.ligature);
        setChecked(updateSelection);
    };

    return (
        <Dialog fullWidth maxWidth="lg" onClose={() => onClose(false)} open={show} TransitionComponent={Transition} {...rest}>
            <DialogTitle className={classes.header}>
                <Grid container>
                    <Grid container item lg={4} md={4} sm={12} xs={12} alignItems="center" justifyContent="flex-start">
                        <Typography color="inherit" variant="h6" component="h1" noWrap>
                            {title}
                        </Typography>
                    </Grid>
                    <Grid container item lg={4} md={4} sm={8} xs={12} alignItems="center" justifyContent="center" alignContent="flex-start">
                        <SearchInput onSearch={(value) => setSearch(value)} placeholder="Search Icons" />
                    </Grid>
                    <Grid container item lg={4} md={4} sm={4} xs={12} alignItems="center" justifyContent="flex-end">
                        <Tooltip title="Close Dialog">
                            <IconButton color="inherit" size="small" onClick={() => onClose(false)} aria-label="Close">
                                <Icon color="inherit">close</Icon>
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent className={classes.body}>
                <Grid className={classes.content} container justifyContent="center">
                    {MATERIAL_ICONS.categories ? (
                        MATERIAL_ICONS.categories.map((category, idx) => {
                            return (
                                <IconDisplay
                                    selectedData={checked}
                                    multi={multi}
                                    key={category.id + '_' + idx}
                                    filter={search}
                                    onIconClick={handleClick}
                                    {...category}
                                />
                            );
                        })
                    ) : (
                        <p align="center">There is no icon.</p>
                    )}
                </Grid>
            </DialogContent>
            {multi ? (
                <DialogActions>
                    <Button onClick={() => onClose(checked)} color="primary" variant="contained">
                        <Icon>done</Icon> Ok
                    </Button>
                    <Button onClick={() => onClose(false)} color="default" variant="contained">
                        <Icon>close</Icon> Cancel
                    </Button>
                </DialogActions>
            ) : null}
        </Dialog>
    );
};

IconPicker.defaultProps = {
    title: 'Icon Browser',
    selectedData: [],
    onError: (error) => console.warn(error),
};

export default IconPicker;
