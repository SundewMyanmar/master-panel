import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router";
import {
    Card, CardActionArea, CardContent, CardMedia, Table, TableFooter, TableRow,
    Grid, Typography, Icon, IconButton, TablePagination, Divider
} from '@material-ui/core';

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
        const { classes, items, total, pageSize, currentPage, handleChangePage, handleChangeRowsPerPage, _this, onClickCard } = this.props;

        return (
            <div>
                <Grid container spacing={8} style={{ padding: '8px 8px 0px 8px' }}>
                    {items.map(item => {
                        return (
                            <Grid key={item.id} container item justify="center" xs={12} sm={12} md={6} lg={2}>
                                <Card className={classes.card} onClick={() => onClickCard(item)}>
                                    <CardActionArea>
                                        <CardMedia
                                            className={classes.media}
                                            image={item.public_url ? item.public_url : "/res/default-image.png"}
                                            title={item.name ? item.name : "No Image"}
                                        />
                                        <Divider light />
                                        <CardContent style={{ padding: "4px 8px 8px 8px" }}>
                                            <Typography style={{ marginBottom: 4 }} variant="subtitle2" align="center" noWrap >{item.name}</Typography>
                                            <Grid container>
                                                <Grid item xs={6}>
                                                    <Typography variant="caption">{item.size}</Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="caption" align="right">{item.extension}</Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                        {/* <Divider light/>
                                        <CardActions style={{ justifyContent : "flex-end"}}>
                                            <IconButton color="secondary" aria-label="Edit">
                                                <Icon fontSize="small">edit</Icon>
                                            </IconButton>
                                            <IconButton aria-label="Delete" style={{ color: this.props.theme.palette.common.red }} >
                                                <Icon fontSize="small">delete</Icon>
                                            </IconButton>
                                        </CardActions> */}
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        )
                    })}
                </Grid>
                <Table className={classes.table}>
                    <TableFooter>
                        <TableRow>
                            <StyledPager
                                rowsPerPageOptions={[12, 18, 24]}
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