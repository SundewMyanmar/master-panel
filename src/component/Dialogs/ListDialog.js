import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, ListItemText, Divider, Typography, Button, Dialog, DialogActions, withStyles } from '@material-ui/core';

const styles = theme => ({
    title: {
        flex: '0 0 auto',
        margin: 0,
        padding: '24px 24px 20px',
        backgroundColor: theme.palette.primary.main,
    }
});

class ListDialog extends React.Component {

    render() {
    const { classes, title, onClose, showDialog, itemList } = this.props;

        return (
        <div>
            <Dialog
                open={showDialog}
                onClose={onClose}
                scroll="paper"
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div className={classes.title}>
                    <Typography style={{ color: 'white' }} variant="h6" gutterBottom>{title}</Typography>
                </div>
                <div style={{ width: '280px', padding: '0px 8px' }}>
                    <List>
                        {itemList.map(d => {
                            return (
                                <div key={d.id}>
                                    <ListItem>
                                        <ListItemText primary={d.display_name} />
                                    </ListItem>
                                    <Divider light variant="inset" component="li" />
                                </div>
                            );
                        })}
                    </List>
                </div>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
        );
    }
}

ListDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListDialog);
