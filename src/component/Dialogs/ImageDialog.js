import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';

const styles = theme => ({
    root: {
        padding: '3px 3px 0px 3px',
    },
    btnClose: {
        position: 'absolute',
        top: '0px',
        right: '0px',
        color: 'white'
    },
});

class AlertDialog extends React.Component {

    render() {
    const { classes, showImage, image, onClose } = this.props;

        return (
            <Dialog
                scroll="body"
                open={showImage}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >   
                <div className={classes.root}>
                    <IconButton onClick={onClose} className={classes.btnClose} aria-label="Close">
                        <Icon fontSize="large">cancel</Icon>
                    </IconButton>
                    <img width="100%" height="100%" src={image} alt="img" />
                </div>
            </Dialog>
        );
    }
}

AlertDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AlertDialog);