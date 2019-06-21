import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { withStyles, Dialog, DialogContent, Typography, IconButton, Icon, Grid, Divider, CardMedia} from '@material-ui/core';

const styles = theme => ({
    header: {
        padding: theme.spacing.unit,
        backgroundColor: theme.palette.primary.main,
    },
    headerTitle: {
        color: "#ffffff",
    },
    btnClose: {
        color: "#ffffff"
    },
    icons: {
        padding: theme.spacing.unit,
    },
    media: {
        width: 64,
        height: 64,
        borderRadius: 6,
        marginBottom: theme.spacing.unit,
    }
});

class AlertDialog extends React.Component {

    render() {
        const { classes, items, onOpenDialog, onCloseDialog } = this.props;

        const order_items = items.order_items ? items.order_items : [];
        const address = items.address ? items.address : "";
        var number = 0;
        var total = 0;
        
        if(items.agent)
            var agent_image = items.agent.profile_image ? items.agent.profile_image.public_url : "/res/icon@256.png";

        return (
            <Dialog aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="md"
                open={onOpenDialog}
                onClose={onCloseDialog}
            >
                <Grid container alignItems="center" className={classes.header}>
                    <Grid item xs={10}>
                        <Typography  variant="h6" className={classes.headerTitle}>Order Detail</Typography>
                    </Grid>
                    <Grid item xs={2} container justify="flex-end">
                        <IconButton className={classes.btnClose} onClick={onCloseDialog}>
                            <Icon>close</Icon>
                        </IconButton>
                    </Grid>
                </Grid>
                <DialogContent>
                    <Grid container style={{ padding : "16px 0px" }}>
                        <Grid item xs={6} container>
                            <Grid item container direction="row" alignItems="center">
                                <Icon className={classes.icons} fontSize="small" color="primary">person</Icon>
                                <Typography variant="body2">{items.user_name}</Typography>
                            </Grid>
                            <Grid item container direction="row" alignItems="center">
                                <Icon className={classes.icons} fontSize="small" color="primary">local_phone</Icon>
                                <Typography variant="body2">{items.phone}</Typography>
                            </Grid>
                            <Grid item container direction="row" alignItems="center">
                                <Icon className={classes.icons} fontSize="small" color="primary">location_on</Icon>
                                <Typography variant="body2">{address.uni ? address.uni : address}</Typography>
                            </Grid>
                        </Grid>
                        <Grid item container xs={6} alignItems="flex-end" direction="column">
                            <CardMedia
                                className={classes.media}
                                image={agent_image}
                            />
                            <Typography variant="body2">{items.agent_name}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2">Order No : <span style={{color:this.props.theme.palette.primary.main}}>{items.order_no}</span></Typography>
                        </Grid>
                        <Grid item xs={6} container justify="flex-end">
                            <Typography variant="subtitle2">Order Date : <span style={{color:this.props.theme.palette.primary.main}}>{items.order_date}</span></Typography>
                        </Grid>
                    </Grid>
                    <Divider light style={{ marginBottom: 16}} />
                    <Grid container>
                        <Grid item xs={1} container justify="center">
                            <Typography variant="subtitle2">#</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2">Menu Name</Typography>
                        </Grid>
                        <Grid item xs={2} container justify="center">
                            <Typography variant="subtitle2">Price</Typography>
                        </Grid>
                        <Grid item xs={1} container justify="center">
                            <Typography variant="subtitle2">Qty</Typography>
                        </Grid>
                        <Grid item xs={2} container justify="flex-end">
                            <Typography variant="subtitle2">Amount</Typography>
                        </Grid>
                    </Grid>
                    <Divider light style={{ margin: "8px 0px"}} />
                    {order_items.map(item => {
                        number = number + 1;
                        var amount = item.price * item.qty;
                        total = total + amount;
                        return (
                            <Grid key={item.id} container>
                                <Grid item xs={1} container justify="center">
                                    <Typography variant="body2" gutterBottom>{number}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" gutterBottom>{item.menu.name_en}</Typography>
                                    <Typography variant="caption" gutterBottom>({item.menu.name_my.zg})</Typography>
                                </Grid>
                                <Grid item xs={2} container justify="center">
                                    <Typography variant="body2"gutterBottom>{item.price} MMK</Typography>
                                </Grid>
                                <Grid item xs={1} container justify="center">
                                    <Typography variant="body2"gutterBottom>{item.qty}</Typography>
                                </Grid>
                                <Grid item xs={2} container justify="flex-end">
                                    <Typography variant="body2"gutterBottom>{item.price * item.qty} MMK</Typography>
                                </Grid>
                            </Grid>
                        );
                    })}
                    <Divider light style={{ margin: "8px 0px"}} />
                    <Grid container>
                        <Grid item xs={1}>
                        </Grid>
                        <Grid item xs={9}>
                            <Typography variant="subtitle2">Total</Typography>
                        </Grid>
                        <Grid item xs={2} container justify="flex-end">
                            <Typography variant="subtitle2">{total} MMK</Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        );
    }
}

AlertDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const mapStateToProps = (state) =>{
    return{
        lunchbox : state
    }
}

export default connect(mapStateToProps)(withStyles(styles,{ withTheme: true })(AlertDialog));