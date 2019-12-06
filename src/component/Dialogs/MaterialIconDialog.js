import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import MaterialIconView from '../MaterialIconView';
import Toolbar from '@material-ui/core/Toolbar';
import { primary} from '../../config/Theme';
import { Icon, IconButton, Typography } from '@material-ui/core';

const styles = theme => ({
    toolbar: {
        backgroundColor: primary.main
    },
    title: {
        color: primary.contrastText
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing.unit * 2,
        color: primary.contrastText,
    },
})

class MaterialIconDialog extends React.Component {
    render() {
        const { onIconClick, showDialog, _this, classes } = this.props;

        return (
            <Dialog aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"
                fullWidth maxWidth="md" open={showDialog}>

                <Toolbar className={classes.toolbar}>
                    <Typography variant="h6" className={classes.title}>
                        Material Icons
                    </Typography>
                    <IconButton className={classes.closeButton} color="inherit" onClick={() => onIconClick(false, _this)}>
                        <Icon className={classes.iconButton}>close</Icon>
                    </IconButton>
                </Toolbar>

                <DialogContent style={{ padding: '0' }}>
                    <MaterialIconView onIconClick={onIconClick ? onIconClick : () => console.log("Picked Icon")} _this={_this} />
                </DialogContent>
            </Dialog>
        )
    }
}

MaterialIconDialog.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        masterpanel: state
    }
}

export default connect(mapStateToProps)(withStyles(styles)(MaterialIconDialog));