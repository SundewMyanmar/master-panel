import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Dialog, List, ListSubheader, ListItem, ListItemText, ListItemIcon, Icon } from '@material-ui/core';

const styles = theme => ({
    root: {
        width: 360,
        maxWidth: 360,
    },
});

class MenuListDialog extends React.Component {

    render() {
        const { classes, handleMenuListDialog, show, uploadNew, openFile } = this.props;

        return (
            <div>
                <Dialog
                    open={show}
                    onClose={handleMenuListDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <List component="nav"
                        aria-labelledby="nested-list-subheader"
                        subheader={
                            <ListSubheader component="div" id="nested-list-subheader">
                                Image Upload
                        </ListSubheader>
                        }
                        className={classes.root}
                    >
                        <ListItem button onClick={openFile}>
                            <ListItemIcon>
                                <Icon color="primary">photo</Icon>
                            </ListItemIcon>
                            <ListItemText primary="Choose From Gallery" />
                        </ListItem>
                        <ListItem button onClick={uploadNew}>
                            <ListItemIcon>
                                <Icon color="primary">cloud_upload</Icon>
                            </ListItemIcon>
                            <ListItemText primary="Upload New Image" />
                        </ListItem>
                    </List>
                </Dialog>
            </div>
        );
    }
}

MenuListDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuListDialog);
