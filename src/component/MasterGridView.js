import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router";
import {
    Card, CardHeader, CardActions, CardContent, CardMedia, Table,
    TableFooter, TableRow, List, ListItem, ListItemIcon, ListItemText,
    Grid, Typography, Tooltip, Icon, IconButton, TablePagination, Divider
} from '@material-ui/core';


import FormatManager from '../util/FormatManager';

const styles = theme => ({
    pager: {
        flexShrink: 0,
    },
    card: {
        maxWidth: 345,
        width: '100%',
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
});

const StyledPager = withStyles(theme => ({
    root: {
        color: theme.palette.primary.main,
        flex: 1,

    },
    selectRoot: {
        width: 50,
    },
    selectIcon: {
        color: theme.palette.primary.main
    }
}))(TablePagination);

class GridView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    TablePaginationActions = () => {
        const { classes, theme, pageChange, _this } = this.props;

        return (<div className={[classes.pager]}>
            <IconButton onClick={() => pageChange("first", _this)} aria-label="First Page">
                {theme.direction === 'rtl' ? <Icon style={{ color: this.props.theme.palette.primary.main, fontSize: 22 }}>last_page</Icon> :
                    <Icon style={{ color: this.props.theme.palette.primary.main, fontSize: 22 }}>first_page</Icon>}
            </IconButton>
            <IconButton onClick={() => pageChange("previous", _this)} aria-label="Previous Page">
                {theme.direction === 'rtl' ? <Icon style={{ color: this.props.theme.palette.primary.main, fontSize: 22 }}>chevron_right</Icon> :
                    <Icon style={{ color: this.props.theme.palette.primary.main, fontSize: 22 }}>chevron_left</Icon>}
            </IconButton>
            <IconButton onClick={() => pageChange("forward", _this)} aria-label="Next Page">
                {theme.direction === 'rtl' ? <Icon style={{ color: this.props.theme.palette.primary.main, fontSize: 22 }}>chevron_left</Icon> :
                    <Icon style={{ color: this.props.theme.palette.primary.main, fontSize: 22 }}>chevron_right</Icon>}
            </IconButton>
            <IconButton onClick={() => pageChange("last", _this)} aria-label="Last Page">
                {theme.direction === 'rtl' ? <Icon style={{ color: this.props.theme.palette.primary.main, fontSize: 22 }}>first_page</Icon> :
                    <Icon style={{ color: this.props.theme.palette.primary.main, fontSize: 22 }}>last_page</Icon>}
            </IconButton>
        </div>);
    }

    handleSortBy(sortBy) {
        const { items } = this.props;
        var sortOrder = this.state.sortOrder;
        if (this.state.sortBy === sortBy) {
            sortOrder = !this.state.sortOrder;
        }
        else {
            sortOrder = true;
        }

        const result =
            !sortOrder
                ? items.sort((a, b) => (b[sortBy] < a[sortBy] ? -1 : 1)) :
                items.sort((a, b) => (a[sortBy] < b[sortBy] ? -1 : 1));

        this.setState({
            sortBy: sortBy,
            sortOrder: sortOrder,
            items: result
        });
    }

    render() {
        const { classes, items, editButton, deleteButton, total, pageSize, currentPage, handleChangePage, handleChangeRowsPerPage, _this } = this.props;

        return (
            <div>
                <Grid container spacing={16} style={{ marginTop: '8px' }}>
                    {items.map(item => {
                        return (
                            <Grid key={item.id} item container justify="center" xs={12} sm={6} md={4} lg={3} >
                                <Card className={classes.card}>
                                    <CardHeader
                                        avatar={
                                            <Tooltip title={item.active ? "This menu is active." : "This menu is not active."} aria-label="isActive">
                                                <Icon style={{ fontSize: '16px', color: item.active ? this.props.theme.palette.common.green : this.props.theme.palette.common.red }} >lens</Icon>
                                            </Tooltip>
                                        }
                                        title={item.name_en}
                                    // subheader="September 14, 2016"
                                    />
                                    <CardMedia
                                        className={classes.media}
                                        image={item.image ? item.image.public_url : "/res/default-image.png"}
                                        title={item.image ? item.image.name : "Default"}
                                    />
                                    <CardContent>
                                        <List>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <Icon fontSize="small">receipt</Icon>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={<Typography variant="body2" style={{ textDecoration: item.order_available ? "none" : "line-through red" }}>Order Available</Typography>}
                                                // secondary="Secondary text"
                                                />
                                                {/* <ListItemSecondaryAction>
                                                    <Icon style={{ color : item.order_available ? this.props.theme.palette.common.red : this.props.theme.palette.common.green }}>cancel</Icon>
                                                </ListItemSecondaryAction> */}
                                            </ListItem>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <Icon fontSize="small">watch_later</Icon>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={<Typography variant="body2">{FormatManager.formatDate(item.order_valid_date, "YYYY/MM/DD (ddd)")}</Typography>}
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <Icon fontSize="small">money</Icon>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={<Typography variant="body2">{item.price} MMK</Typography>}
                                                />
                                            </ListItem>
                                            {item.ingredient ? (
                                                <ListItem>
                                                    <ListItemIcon style={{ alignSelf: "baseline" }}>
                                                        <Icon fontSize="small">restaurant_menu</Icon>
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={<Typography style={{ textAlign: "justify" }} variant="body2">{item.ingredient}</Typography>}
                                                    />
                                                </ListItem>

                                            ) : (
                                                    <div></div>
                                                )}
                                        </List>
                                    </CardContent>
                                    <Divider variant="middle" />
                                    <CardActions>
                                        <Grid container justify="flex-end">
                                            <IconButton color="secondary" aria-label="Edit" onClick={() => editButton(item.id, _this)}>
                                                <Icon>edit</Icon>
                                            </IconButton>
                                            <IconButton style={{ color: this.props.theme.palette.common.red }} aria-label="Delete" onClick={() => deleteButton(item.id, item.name ? item.name : item.display_name, _this, item)}>
                                                <Icon>delete</Icon>
                                            </IconButton>
                                        </Grid>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )
                    })}
                </Grid>
                <Table className={classes.table}>
                    <TableFooter>
                        <TableRow>
                            <StyledPager
                                rowsPerPageOptions={[8, 12, 24]}
                                colSpan={5}
                                count={total}
                                rowsPerPage={pageSize}
                                labelRowsPerPage="Page Size :"
                                page={currentPage}
                                SelectProps={{
                                    native: true,
                                }}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={(event) => {
                                    handleChangeRowsPerPage(event, _this)
                                }}
                                ActionsComponent={this.TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        );
    }
}

GridView.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired
};

export default withRouter(withStyles(styles, { withTheme: true })(GridView));