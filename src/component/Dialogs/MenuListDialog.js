import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Dialog, List, ListSubheader, ListItem, ListItemText, ListItemIcon, Icon } from '@material-ui/core';

const styles = () => ({
    root: {
        width: 360,
        maxWidth: 360,
    },
});

class MenuListDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    renderMenuItem = item => {
        return (
            <ListItem button onClick={() => this.props.onItemClick(item)} key={item.name}>
                <ListItemIcon>
                    <Icon color="primary">{item.icon}</Icon>
                </ListItemIcon>
                <ListItemText primary={item.label} />
            </ListItem>
        );
    };

    render() {
        const { classes, title, items, onClose, showDialog } = this.props;

        return (
            <React.Fragment>
                <Dialog open={showDialog} onClose={onClose} aria-labelledby={title} onEscapeKeyDown={onClose}>
                    <List
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                        subheader={
                            <ListSubheader component="div" id="nested-list-subheader">
                                {title}
                            </ListSubheader>
                        }
                        className={classes.root}
                    >
                        {items.map(item => this.renderMenuItem(item))}
                    </List>
                </Dialog>
            </React.Fragment>
        );
    }
}

MenuListDialog.defaultProps = {
    title: 'Choose one menu',
    items: [],
    onItemClick: menu => console.log('Clicked Menu => ', menu),
};

MenuListDialog.propTypes = {
    title: PropTypes.string,
    items: PropTypes.array.isRequired,
    onItemClick: PropTypes.func,
};

export default withStyles(styles)(MenuListDialog);
