import React from 'react';
import PropTypes from 'prop-types';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

export default class AlertDialog extends React.Component {
    render() {
        const { title, description, onClickOk, showDialog } = this.props;

        return (
            <div>
                <Dialog fullWidth maxWidth="sm" open={showDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
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

AlertDialog.defaultProps = {
    showDialog: false,
};

AlertDialog.propTypes = {
    showDialog: PropTypes.bool.isRequired,
    onClickOk: PropTypes.func.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
};
