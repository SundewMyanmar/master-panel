import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import {
    Button,
    Dialog,
    DialogTitle as MuiDialogTitle,
    DialogContent as MuiDialogContent,
    DialogActions as MuiDialogActions,
    IconButton,
    Icon,
    Typography,
    Input,
    InputLabel,
    InputAdornment,
    FormControl,
    FormHelperText,
} from '@material-ui/core';

const DialogTitle = withStyles(theme => ({
    root: {
        // borderBottom: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing(2),
        backgroundColor: '#31376b',
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}))(props => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography style={{ color: 'white' }} variant="h6">
                {children}
            </Typography>
            {onClose ? (
                <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
                    <Icon>close</Icon>
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
    root: {
        // borderTop: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

class PasswordDialog extends React.Component {
    render() {
        return (
            <Dialog fullWidth={true} maxWidth="sm" aria-labelledby="customized-dialog-title" open={this.props.open} onClose={this.props.handleClose}>
                <DialogTitle id="customized-dialog-title" onClose={this.props.handleClose}>
                    Change Password
                </DialogTitle>
                <div style={{ backgroundColor: '#d32f2f', display: this.props.hasError ? '' : 'none' }}>
                    <Typography style={{ color: 'white', margin: '4px 16px' }} variant="subtitle2" gutterBottom>
                        {this.props.errorMessage}
                    </Typography>
                </div>
                <DialogContent>
                    <FormControl fullWidth error={this.props.oldPswError ? true : false}>
                        <InputLabel htmlFor="old_password">Old Password</InputLabel>
                        <Input
                            autoFocus
                            id="old_password"
                            type={this.props.showPassword ? 'text' : 'password'}
                            value={this.props.old_password}
                            onChange={event => this.props.onChangeText(event.target.id, event.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton aria-label="Toggle password visibility" onClick={this.props.handleClickShowPassword}>
                                        {this.props.showPassword ? <Icon>visibility</Icon> : <Icon>visibility_off</Icon>}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        {this.props.oldPswError ? (
                            <FormHelperText id="component-helper-text">old password field is empty</FormHelperText>
                        ) : (
                            <FormHelperText id="component-helper-text">enter your old password</FormHelperText>
                        )}
                    </FormControl>
                    <FormControl fullWidth style={{ marginTop: '10px' }} error={this.props.newPswError ? true : false}>
                        <InputLabel htmlFor="new_password">New Password</InputLabel>
                        <Input
                            id="new_password"
                            type={this.props.showPassword ? 'text' : 'password'}
                            value={this.props.new_password}
                            onChange={event => this.props.onChangeText(event.target.id, event.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton aria-label="Toggle password visibility" onClick={this.props.handleClickShowPassword}>
                                        {this.props.showPassword ? <Icon>visibility</Icon> : <Icon>visibility_off</Icon>}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        {this.props.newPswError ? (
                            <FormHelperText id="new_password">new password field is empty</FormHelperText>
                        ) : (
                            <FormHelperText id="new_password">size must be between 6 and 255</FormHelperText>
                        )}
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.props.onSaveItem()} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default PasswordDialog;
