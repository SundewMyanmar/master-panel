import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText';

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
      margin: theme.spacing.unit * 2,
      position: 'relative',
      color:theme.palette.primary.contrastText
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

class AlertDialog extends React.Component {

  render() {
    const { classes, showLoading, message} = this.props;

    return (
      <div>
        <Dialog
          maxWidth="sm"
          open={showLoading}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div className={classes.flex}>
            <div className={classes.progress}>
              <CircularProgress
                variant="determinate"
                value={100}
                className={classes.secondary}
                size={40}
                thickness={4}
              />
              <CircularProgress
                variant="indeterminate"
                disableShrink
                className={classes.main}
                size={40}
                thickness={4}
              />
            </div>
            <DialogContentText id="alert-dialog-description" className={classes.progress} >
                {message}
            </DialogContentText>
          </div>
        </Dialog>
      </div>
    );
  }
}

AlertDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AlertDialog);
