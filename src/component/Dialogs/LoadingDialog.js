import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress, Dialog, DialogContentText } from '@material-ui/core';

const styles = theme => ({
    flex: {
        display: 'flex',
        alignItems: 'center',
        padding: '8px 8px',
    },
    loading: {
        flex: 2,
    },
    progress: {
        margin: theme.spacing(2),
        position: 'relative',
        // color:theme.palette.primary.contrastText
    },
    secondary: {
        color: '#eef3fd',
    },
    main: {
        animationDuration: '550ms',
        position: 'absolute',
        left: 0,
    },
});

class LoadingDialog extends React.Component {
    static defaultProps = {
        showLoading: false,
    };

    render() {
        const { classes, showLoading, message } = this.props;

        return (
            <div>
                <Dialog maxWidth="sm" open={showLoading} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <div className={classes.flex}>
                        <div className={classes.progress}>
                            <CircularProgress variant="determinate" value={100} className={classes.secondary} size={40} thickness={4} />
                            <CircularProgress variant="indeterminate" disableShrink className={classes.main} size={40} thickness={4} />
                        </div>
                        <DialogContentText id="alert-dialog-description" className={classes.progress}>
                            {message}
                        </DialogContentText>
                    </div>
                </Dialog>
            </div>
        );
    }
}

LoadingDialog.defaultProps = {
    message: 'Loading ...',
};

LoadingDialog.propTypes = {
    showLoading: PropTypes.bool.isRequired,
    message: PropTypes.string,
};

export default withStyles(styles)(LoadingDialog);
