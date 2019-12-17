import React from 'react';
import PropTypes from 'prop-types';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

class QuestionDialog extends React.Component {
    state = {};

    render() {
        const { onDialogAction } = this.props;

        return (
            <div>
                <Dialog open={this.props.showQuestion} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{this.props.questionTitle ? this.props.questionTitle : 'Delete'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {this.props.questionText ? this.props.questionText : 'Are you sure want to delete'}
                            <span style={{ color: '#e10050' }}> {this.props.itemName}</span>?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => onDialogAction(false)} color="secondary" autoFocus={true}>
                            Cancel
                        </Button>
                        <Button onClick={() => onDialogAction(true)} color="primary">
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

QuestionDialog.defaultProps = {
    onDialogAction: isOk => console.log('Question Result => ', isOk),
};

QuestionDialog.propTypes = {
    onDialogAction: PropTypes.func.isRequired,
};

export default QuestionDialog;
