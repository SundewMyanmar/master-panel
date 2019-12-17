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
    Table,
    TableFooter,
    TableRow,
    InputBase,
    DialogTitle,
    DialogContent,
} from '@material-ui/core';
import MasterPaginationBar from '../MasterPaginationBar';
import FileApi from '../../api/FileApi';

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

class FileDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 9,
            currentPage: 0,
            total: 0,
            pageCount: 1,
            searchText: '',
            data: [],
            showLoading: false,
        };
    }

    componentDidMount() {
        this.loadFiles();
    }

    loadFiles = async () => {
        this.setState({ showLoading: true });
        let newState = {
            showLoading: false,
        };

        try {
            const result = await FileApi.getPaging(this.state.currentPage, this.state.pageSize, 'createdAt:DESC', this.state.searchText);
            console.log('Get FIles => ', result);
            if (result.count > 0) {
                newState.data = result.data;
                newState.total = result.total;
                newState.pageCount = result.pageCount;
            }
        } catch (error) {
            console.log('Load Files => ', error);
            this.props.onError(error);
        }
        this.setState(newState);
    };

    handlePageSizeChange = pageSize => {
        this.setState({ currentPage: 0, pageSize: pageSize }, () => this.loadFiles());
    };

    handlePageChange = page => {
        this.setState({ currentPage: page }, () => this.loadFiles());
    };

    handleSearch = () => {
        this.setState({ currentPage: 0 }, () => this.loadFiles());
    };

    handleSearchChange = e => {
        this.setState({ searchText: e.target.value });
    };

    handleSearchKeyDown = e => {
        if (e.keyCode === 13) {
            this.handleSearch();
        }
    };

    handleUploadImage = async event => {
        try {
            var reader = new FileReader();
            var file = event.target.files[0];
            reader.readAsDataURL(file);
            if (file) {
                var fileResponse = await FileApi.upload(file);
                if (fileResponse) {
                    this.loadFiles();
                }
            }
        } catch (error) {
            console.error('File Upload => ', error);
            this.props.onError(error);
        }
    };

    renderHeader = () => {
        const { classes } = this.props;
        return (
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
                            value={this.state.searchText}
                            onKeyDown={this.handleSearchKeyDown}
                            onChange={this.handleSearchChange}
                        />
                        <IconButton className={classes.iconButton} aria-label="Search" onClick={this.handleSearch}>
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
                        onChange={event => this.handleUploadImage(event)}
                    />
                    <label htmlFor="image_upload">
                        <Tooltip title="Upload New" placement="left">
                            <IconButton style={{ color: 'white' }} aria-label="Upload" component="span">
                                <Icon>cloud_upload</Icon>
                            </IconButton>
                        </Tooltip>
                    </label>
                    <Tooltip title="Close Gallery">
                        <IconButton style={{ color: 'white' }} onClick={this.props.onClose} aria-label="Close">
                            <Icon>close</Icon>
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        );
    };

    renderItem = (item, index) => {
        if (!item) {
            return <CircularProgress style={{ padding: 24 }} />;
        }

        const { classes } = this.props;

        return (
            <Grid key={item.id} container item justify="center" xs={12} sm={12} md={6} lg={2}>
                <Card className={classes.card} onClick={() => this.props.onFileClick(item)}>
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
    };

    render() {
        const { classes, showDialog, onClose } = this.props;

        return (
            <React.Fragment>
                <Dialog fullWidth maxWidth="xl" onEscapeKeyDown={onClose} open={showDialog} onClose={onClose} TransitionComponent={Transition}>
                    <DialogTitle style={{ borderRadius: 0, padding: '8px 24px', backgroundColor: this.props.theme.palette.primary.main }}>
                        {this.renderHeader()}
                    </DialogTitle>
                    <DialogContent>
                        <Grid container item xs={12} style={{ padding: '8px 0px 8px 8px' }} spacing={8}>
                            {this.state.data.map(this.renderItem)}
                        </Grid>
                    </DialogContent>
                    <Table className={classes.table}>
                        <TableFooter>
                            <TableRow>
                                <MasterPaginationBar
                                    rowsPerPage={[3, 9, 18]}
                                    total={this.state.total}
                                    pageSize={this.state.pageSize}
                                    currentPage={this.state.currentPage}
                                    onPageChange={this.handlePageChange}
                                    onPageSizeChange={this.handlePageSizeChange}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </Dialog>
            </React.Fragment>
        );
    }
}

FileDialog.defaultProps = {
    onFileClick: item => console.log('Choose File => ', item),
    onError: error => console.log('Error => ', error),
};

FileDialog.propTypes = {
    showDialog: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onError: PropTypes.func,
    onFileClick: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(FileDialog);
