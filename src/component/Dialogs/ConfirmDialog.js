import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@material-ui/core';

const styles = theme => ({
});

class ConfirmDialog extends React.Component {

    render() {
        const { title, description, onClickOk, showDialog } = this.props;

        return (
            <div>
                <Dialog
                    fullWidth
                    maxWidth="sm"
                    open={showDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {description}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClickOk} color="primary">
                            Ok
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

ConfirmDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ConfirmDialog);
