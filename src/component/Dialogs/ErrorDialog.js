import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = theme => ({
});

class ErrorDialog extends React.Component {
    static defaultProps = {
        showError: false
    };

    render() {
        const { title, description, handleError, showError } = this.props;

        return (
            <div>
                <Dialog
                    fullWidth
                    maxWidth="sm"
                    open={showError}
                    onClose={handleError}
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
                        <Button onClick={handleError} color="primary">
                            Ok
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

ErrorDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ErrorDialog);
