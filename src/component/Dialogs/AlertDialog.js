import React from 'react';
import PropTypes from 'prop-types';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

export default class AlertDialog extends React.Component {
    render() {
        const { title, description, onOkButtonClick, showDialog } = this.props;

        return (
            <div>
                <Dialog fullWidth maxWidth="sm" open={showDialog} aria-labelledby={title}>
                    <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onOkButtonClick} color="primary">
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

AlertDialog.defaultProps = {
    showDialog: false,
};

AlertDialog.propTypes = {
    showDialog: PropTypes.bool.isRequired,
    onOkButtonClick: PropTypes.func.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
};
