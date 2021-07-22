import React, { useState } from 'react';
import {
    Dialog,
    Zoom,
    ListProps,
    List,
    ListSubheader,
    ListItemIcon,
    Icon,
    ListItemText,
    ListItem,
    Divider,
    makeStyles,
    DialogActions,
    Button,
} from '@material-ui/core';
import Transition from './Transition';

type ListPickerProps = {
    ...ListProps,
    data: Array<Objec>,
    show: boolean,
    values?: Array<Object>,
    multi: boolean,
    title: ?string,
    idField?: string,
    iconField?: string,
    labelField?: string,
    onChange?: (result: Object | boolean) => void,
    onClose: (result: Object | Array<Object>) => void,
};

const itemStyles = makeStyles(theme => ({
    root: {},
    icon: props => ({
        color: props.selected ? theme.palette.text.active : theme.palette.text.primary,
        display: 'inline-flex',
        flexShrink: 0,
        minWidth: theme.spacing(4),
    }),
    text: props => ({
        color: props.selected ? theme.palette.text.active : theme.palette.text.primary,
    }),
}));

const CustomListItem = props => {
    const { multi, label, icon, isMarked, onClick, ...rest } = props;
    const classes = itemStyles({ selected: isMarked });

    return (
        <ListItem {...rest} button onClick={onClick} className={classes.root} selected={isMarked}>
            <ListItemIcon className={classes.icon}>
                <Icon>{icon}</Icon>
            </ListItemIcon>
            <ListItemText primary={label} className={classes.text} />
        </ListItem>
    );
};

const ListPicker = (props: ListPickerProps) => {
    const { id, name, title, data, multi, show, idField, iconField, labelField, onChange, onClose, ...listProps } = props;
    const [checked, setChecked] = useState(props.values);
    const labeldedBy = id || name + 'list-picker';

    const handleClick = item => {
        if (!multi) {
            onClose(item);
            return;
        }

        const existIdx = checked.findIndex(x => x[idField] === item[idField]);
        const selectedData = existIdx < 0 ? [...checked, item] : checked.filter(x => x[idField] !== item[idField]);

        setChecked(selectedData);
        onChange(selectedData);
    };

    return (
        <Dialog maxWidth="xs" fullWidth={multi} open={show} onEscapeKeyDown={onClose} onClose={() => onClose(false)} TransitionComponent={Transition}>
            <List
                {...listProps}
                component="nav"
                aria-labelledby={labeldedBy}
                subheader={
                    title && title.length > 0 ? (
                        <ListSubheader component="div" id={labeldedBy + '-subheader'}>
                            {title}
                        </ListSubheader>
                    ) : null
                }
            >
                {data.map((item, idx) => {
                    const isMarked = checked.findIndex(x => x[idField] === item[idField]) >= 0;
                    return (
                        <CustomListItem
                            key={item[idField] + '-' + idx}
                            multi={multi}
                            label={item[labelField]}
                            icon={item[iconField]}
                            isMarked={isMarked}
                            onClick={() => handleClick(item)}
                        />
                    );
                })}
            </List>
            <Divider />
            {multi ? (
                <DialogActions>
                    <Button onClick={() => onClose(true)} color="primary" variant="contained">
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

ListPicker.defaultProps = {
    multi: false,
    idField: 'id',
    iconField: 'icon',
    labelField: 'label',
    title: '',
    values: [],
    onChange: result => console.warn('Undefined onChange => ', result),
    onClose: () => console.log('Undefined onClose'),
};

export default ListPicker;
