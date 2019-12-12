import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Dialog,
    Slide,
    IconButton,
    Icon,
    Typography,
    Grid,
    Paper,
    Tooltip,
    CircularProgress,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Divider,
    TablePagination,
    Table,
    TableFooter,
    TableRow,
    InputBase,
} from '@material-ui/core';

const styles = theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
        color: 'white',
    },
    card: {
        maxWidth: 345,
        width: '100%',
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    pager: {
        flexShrink: 0,
    },
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
    },
    input: {
        marginLeft: 8,
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
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
        color: theme.palette.primary.main,
    },
}))(TablePagination);

class FileDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    TablePaginationActions = () => {
        const { classes, theme, pageChange, _this } = this.props;

        return (
            <div className={[classes.pager]}>
                <IconButton onClick={() => pageChange('first', _this)} aria-label="First Page">
                    {theme.direction === 'rtl' ? (
                        <Icon style={{ color: this.props.theme.palette.primary.main, fontSize: 22 }}>last_page</Icon>
                    ) : (
                        <Icon style={{ color: this.props.theme.palette.primary.main, fontSize: 22 }}>first_page</Icon>
                    )}
                </IconButton>
                <IconButton onClick={() => pageChange('previous', _this)} aria-label="Previous Page">
                    {theme.direction === 'rtl' ? (
                        <Icon style={{ color: this.props.theme.palette.primary.main, fontSize: 22 }}>chevron_right</Icon>
                    ) : (
                        <Icon style={{ color: this.props.theme.palette.primary.main, fontSize: 22 }}>chevron_left</Icon>
                    )}
                </IconButton>
                <IconButton onClick={() => pageChange('forward', _this)} aria-label="Next Page">
                    {theme.direction === 'rtl' ? (
                        <Icon style={{ color: this.props.theme.palette.primary.main, fontSize: 22 }}>chevron_left</Icon>
                    ) : (
                        <Icon style={{ color: this.props.theme.palette.primary.main, fontSize: 22 }}>chevron_right</Icon>
                    )}
                </IconButton>
                <IconButton onClick={() => pageChange('last', _this)} aria-label="Last Page">
                    {theme.direction === 'rtl' ? (
                        <Icon style={{ color: this.props.theme.palette.primary.main, fontSize: 22 }}>first_page</Icon>
                    ) : (
                        <Icon style={{ color: this.props.theme.palette.primary.main, fontSize: 22 }}>last_page</Icon>
                    )}
                </IconButton>
            </div>
        );
    };

    handleSortBy(sortBy) {
        const { items } = this.props;
        var sortOrder = this.state.sortOrder;
        if (this.state.sortBy === sortBy) {
            sortOrder = !this.state.sortOrder;
        } else {
            sortOrder = true;
        }

        const result = !sortOrder ? items.sort((a, b) => (b[sortBy] < a[sortBy] ? -1 : 1)) : items.sort((a, b) => (a[sortBy] < b[sortBy] ? -1 : 1));

        this.setState({
            sortBy: sortBy,
            sortOrder: sortOrder,
            items: result,
        });
    }

    render() {
        const {
            classes,
            handleClose,
            showFile,
            items,
            total,
            pageSize,
            currentPage,
            handleChangePage,
            handleChangeRowsPerPage,
            _this,
            handleFileClick,
            onSearch,
            onKeyDown,
            onChangeText,
            searchFilterText,
            onUploadImage,
        } = this.props;

        return (
            <div>
                <Dialog fullWidth maxWidth="xl" open={showFile} onClose={handleClose} TransitionComponent={Transition}>
                    <Paper style={{ borderRadius: 0, padding: '8px 24px', backgroundColor: this.props.theme.palette.primary.main }}>
                        <Grid container>
                            <Grid container item xs={4} alignItems="center">
                                <Typography style={{ color: 'white' }} variant="h6" component="h1" noWrap>
                                    File Gallery
                                </Typography>
                            </Grid>
                            <Grid container item xs={4} alignItems="center" justify="center">
                                <Paper className={classes.root}>
                                    <InputBase
                                        className={classes.input}
                                        placeholder="Search Files"
                                        inputProps={{ 'aria-label': 'Search Files' }}
                                        value={searchFilterText}
                                        onKeyDown={onKeyDown}
                                        onChange={event => onChangeText(event.target.id, event.target.value)}
                                    />
                                    <IconButton className={classes.iconButton} aria-label="Search" onClick={() => onSearch()}>
                                        <Icon>search</Icon>
                                    </IconButton>
                                </Paper>
                            </Grid>
                            <Grid container item xs={4} alignItems="center" justify="flex-end">
                                <input
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    id="image_upload"
                                    type="file"
                                    onChange={event => onUploadImage(event)}
                                />
                                <label htmlFor="image_upload">
                                    <Tooltip title="Upload New" placement="left">
                                        <IconButton style={{ color: 'white' }} aria-label="Upload" component="span">
                                            <Icon>cloud_upload</Icon>
                                        </IconButton>
                                    </Tooltip>
                                </label>
                                <Tooltip title="Close Gallery">
                                    <IconButton style={{ color: 'white' }} onClick={handleClose} aria-label="Close">
                                        <Icon>close</Icon>
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Paper>
                    <Grid container item xs={12} style={{ padding: '8px 0px 8px 8px' }} spacing={8}>
                        {items ? (
                            items.map(item => {
                                return (
                                    <Grid key={item.id} container item justify="center" xs={12} sm={12} md={6} lg={2}>
                                        <Card className={classes.card} onClick={event => handleFileClick(event, item)}>
                                            <CardActionArea>
                                                <CardMedia
                                                    className={classes.media}
                                                    image={item.public_url ? item.public_url : '/res/default-image.png'}
                                                    title={item.name ? item.name : 'No Image'}
                                                />
                                                <Divider light />
                                                <CardContent style={{ padding: '4px 8px 8px 8px' }}>
                                                    <Typography style={{ marginBottom: 4 }} variant="subtitle2" align="center" noWrap>
                                                        {item.name}
                                                    </Typography>
                                                    <Grid container>
                                                        <Grid item xs={6}>
                                                            <Typography variant="caption">{item.size}</Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Typography variant="caption" align="right">
                                                                {item.extension}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                );
                            })
                        ) : (
                            <CircularProgress style={{ padding: 24 }} />
                        )}
                    </Grid>
                    <Table className={classes.table}>
                        <TableFooter>
                            <TableRow>
                                <StyledPager
                                    rowsPerPageOptions={[12, 18, 24]}
                                    colSpan={10}
                                    count={total}
                                    rowsPerPage={pageSize}
                                    labelRowsPerPage="Page Size :"
                                    page={currentPage}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={event => {
                                        handleChangeRowsPerPage(event, _this);
                                    }}
                                    ActionsComponent={this.TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </Dialog>
            </div>
        );
    }
}

FileDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
};

export default withStyles(styles, { withTheme: true })(FileDialog);
