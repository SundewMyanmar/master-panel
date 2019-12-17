import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MaterialIconView from '../MaterialIconView';
import { primary } from '../../config/Theme';
import { Icon, IconButton, Typography, Dialog, DialogContent, Toolbar } from '@material-ui/core';

const styles = theme => ({
    toolbar: {
        backgroundColor: primary.main,
    },
    title: {
        color: primary.contrastText,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(2),
        color: primary.contrastText,
    },
});

class MaterialIconDialog extends React.Component {
    render() {
        const { onIconClick, showDialog, _this, classes } = this.props;

        return (
            <Dialog aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth maxWidth="md" open={showDialog}>
                <Toolbar className={classes.toolbar}>
                    <Typography variant="h6" className={classes.title}>
                        Material Icons
                    </Typography>
                    <IconButton className={classes.closeButton} color="inherit" onClick={() => onIconClick(false, _this)}>
                        <Icon className={classes.iconButton}>close</Icon>
                    </IconButton>
                </Toolbar>

                <DialogContent style={{ padding: '0' }}>
                    <MaterialIconView onIconClick={onIconClick} />
                </DialogContent>
            </Dialog>
        );
    }
}

MaterialIconDialog.defaultProps = {
    onIconClick: icon => console.log('Clicked Icon => ', icon),
};

MaterialIconDialog.propTypes = {
    showDialog: PropTypes.bool.isRequired,
    onIconClick: PropTypes.func,
};

export default withStyles(styles)(MaterialIconDialog);
