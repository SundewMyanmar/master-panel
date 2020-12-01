import React from 'react';
import { Button, Dialog, DialogContent, DialogTitle, Zoom, Grid, makeStyles, Divider } from '@material-ui/core';
import MasterForm from '../MasterForm';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom in ref={ref} {...props} />;
});

export type FormDialogProps = {
    fields: Array<Field>,
    show: boolean,
    title: string,
    onClose?: () => void,
    onWillSubmit?: (form: Object) => boolean,
    onSubmit?: (event: React.SyntheticEvent<HTMLFormElement>, form: Object) => void,
};

const styles = makeStyles(theme => ({
    buttonContainer: {
        padding: theme.spacing(2, 0),
    },
    button: {
        marginLeft: theme.spacing(2),
    },
}));

export default function FormDialog(props: FormDialogProps) {
    const classes = styles();
    const { title, onClose, onWillSubmit, onSubmit, fields, show } = props;

    return (
        <Dialog maxWidth="sm" open={show} onEscapeKeyDown={() => onClose(false)} TransitionComponent={Transition}>
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <Divider />
            <DialogContent>
                <MasterForm fields={fields} onSubmit={onSubmit} onWillSubmit={onWillSubmit}>
                    <Grid className={classes.buttonContainer} container justify="flex-end">
                        <Button type="submit" color="primary" variant="contained">
                            Submit
                        </Button>
                        <Button className={classes.button} onClick={() => onClose(false)} variant="contained" color="secondary">
                            Cancel
                        </Button>
                    </Grid>
                </MasterForm>
            </DialogContent>
        </Dialog>
    );
}

FormDialog.defaultProps = {
    onClose: () => console.warn('Undefined onClose'),
};
