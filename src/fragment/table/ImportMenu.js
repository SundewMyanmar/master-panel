import React from 'react';
import { ButtonProps, Button, Icon, makeStyles } from '@material-ui/core';
import ImportDialog from './ImportDialog';

const styles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(0.5),
    },
}));

type ImportMenuProps = {
    ...ButtonProps,
    label?: string,
    title?: string,
    onImportItems?: (data) => void,
    fields: Array,
};

const ImportMenu = (props: ImportMenuProps) => {
    const { label, title, fields, onImportItems, ...buttonProps } = props;
    const classes = styles();
    const [showImport, setShowImport] = React.useState(false);

    const handleClose = (result) => {
        if (result && result.length > 0) {
            onImportItems(result);
        }
        setShowImport(false);
    };

    const importablFields = fields.map((field) => ({ name: field, label: field }));

    return (
        <>
            <ImportDialog show={showImport} title={title ? title : 'Import Data'} fields={importablFields} onClose={handleClose} />
            <Button type="button" color="secondary" onClick={() => setShowImport(true)} variant="contained" aria-label="Import Data" {...buttonProps}>
                <Icon className={classes.icon}>cloud_upload</Icon>
                {label ? label : 'Import'}
            </Button>
        </>
    );
};

ImportMenu.defaultProps = {
    onImportItems: (data) => console.warn('Undefined onImportItems => ', data),
};

export default ImportMenu;
