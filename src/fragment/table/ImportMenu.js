import React from 'react';
import { ButtonProps, Button, Icon, Menu, MenuItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import { BATCH_ACTION_MENU } from '../../config/Constant';
import ImportDialog from './ImportDialog';

const styles = makeStyles(theme => ({
    icon: {
        marginRight: theme.spacing(0.5),
    },
}));

type ImportMenuProps = {
    ...ButtonProps,
    label?: String,
    title?: String,
    onImportItems?: (data, cofig) => void,
};

const ImportMenu = (props: ImportMenuProps) => {
    const { label, title, onImportItems, ...buttonProps } = props;
    const classes = styles();
    const [showImport, setShowImport] = React.useState(false);

    const handleClose = result => {
        console.log('Close Dialog => ', result);
        setShowImport(false);
    };

    return (
        <>
            <ImportDialog show={showImport} title={title ? title : 'Import Data'} onClose={handleClose} />
            <Button type="button" color="secondary" onClick={() => setShowImport(true)} variant="contained" aria-label="Import Data" {...buttonProps}>
                <Icon className={classes.icon}>cloud_upload</Icon>
                {label ? label : 'Import'}
            </Button>
        </>
    );
};

ImportMenu.defaultProps = {
    onImportItems: (data, config) => console.warn('Undefined onImportItems => ', data),
};

export default ImportMenu;
