import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class QuestionDialog extends React.Component {
    state = {
    };

    render() {
        const { handleQuestionDialog } = this.props;

        return (
            <div>
                <Dialog
                    open={this.props.showQuestion}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{this.props.questionTitle ? this.props.questionTitle : "Delete"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {this.props.questionText ? this.props.questionText : "Are you sure want to delete"}<span style={{ color: '#e10050' }}> {this.props.itemName}</span>
                            ?
            </DialogContentText>
                    </DialogContent>
                    <DialogActions>

                        <Button onClick={() => handleQuestionDialog(false)} color="primary" autoFocus={true}>
                            Cancel
            </Button>
                        <Button onClick={() => handleQuestionDialog(true)} color="primary">
                            Ok
            </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default QuestionDialog;