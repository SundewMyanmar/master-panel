import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    Table,
    TableFooter,
    TableRow,
    Typography,
    Zoom,
    LinearProgress,
    Card,
    CardActionArea,
    CardMedia,
    Divider,
    CardContent,
    makeStyles,
    Icon,
    DialogActions,
    Button,
    Tooltip,
    IconButton,
} from '@material-ui/core';
import PaginationBar from '../PaginationBar';
import SearchInput from './SearchInput';
import FileApi from '../../api/FileApi';

type FilePickerProps = {
    show: Boolean,
    selectedData: Array<Object> | Object,
    multi: Boolean,
    title?: String,
    currentPage?: Number,
    pageSize?: Number,
    total?: Number,
    onError(error: Object | String): ?Function,
    onSelectionChange(result: Object | Boolean): ?Function,
    onClose(result: Object | Array<Object>): Function,
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom in ref={ref} {...props} />;
});

const itemStyles = makeStyles(theme => ({
    root: {
        maxWidth: 345,
        width: '100%',
        cursor: 'pointer',
    },
    title: {
        marginBottom: theme.spacing(1),
    },
    media: {
        borderBottom: '1px solid ' + theme.palette.divider,
        paddingTop: '75%', // 16:9
    },
    info: {
        padding: theme.spacing(0.5, 2),
    },
    infoRow: {
        padding: theme.spacing(0.5),
        borderTop: '1px solid ' + theme.palette.divider,
    },
    markedIcon: {
        position: 'absolute',
        fontSize: 28,
        bottom: 0,
        right: 0,
    },
}));

const FileInfoField = props => {
    const { label, value, ...rest } = props;
    return (
        <Grid container {...rest}>
            <Grid container item xs={4}>
                <Typography variant="caption">{label}</Typography>
            </Grid>
            <Grid container item xs={8}>
                <Typography variant="subtitle2">{value}</Typography>
            </Grid>
        </Grid>
    );
};

const FileItem = props => {
    const { onClick, multi, isMarked, ...item } = props;
    const [size, setSize] = useState(item.size);
    const classes = itemStyles({ selected: isMarked });
    const isImage = item.type.startsWith('image');
    const url = FileApi.downloadLink(item);

    const handleImageLoading = ({ target: img }) => {
        setSize(img.naturalWidth + ' x ' + img.naturalHeight + ' (' + item.size + ')');
    };

    return (
        <Grid key={item.key} container item justify="center" xs={12} sm={4} md={3} lg={3}>
            <Card className={classes.root} elevation={3}>
                <CardActionArea style={multi ? { position: 'relative' } : null} onClick={onClick}>
                    {isMarked ? (
                        <Icon className={classes.markedIcon} color="secondary">
                            check_box
                        </Icon>
                    ) : null}
                    <CardMedia className={classes.media} image={url || '/res/default-image.png'} title={item.name ? item.name : 'No Image'} />
                    {url && isImage ? <img onLoad={handleImageLoading} src={url} alt={item.name} style={{ display: 'none' }} /> : null}
                    <Divider light />
                    <CardContent className={classes.info}>
                        <Typography className={classes.title} variant="subtitle2" align="center" noWrap>
                            {item.name + '.' + item.extension}
                        </Typography>
                        <FileInfoField label="Size" className={classes.infoRow} value={size} />
                        <FileInfoField label="Type" className={classes.infoRow} value={item.type} />
                        <FileInfoField label="Access" className={classes.infoRow} value={item.publicAccess ? 'Public' : 'Private'} />
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    );
};

const styles = makeStyles(theme => ({
    content: {
        backgroundColor: theme.palette.background.default,
        borderTop: '1px solid ' + theme.palette.divider,
        borderBottom: '1px solid ' + theme.palette.divider,
        padding: theme.spacing(2, 2.5),
    },
    header: {
        padding: theme.spacing(1, 2),
    },
    noLoading: {
        height: 4,
        display: 'block',
    },
}));

const FilePicker = (props: FilePickerProps) => {
    const classes = styles();
    const { title, multi, selectedData, show, onSelectionChange, onClose, onError } = props;
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(selectedData);
    const [search, setSearch] = useState('');

    const loadFiles = async (currentPage, pageSize) => {
        setLoading(true);
        try {
            const result = await FileApi.getPaging(currentPage, pageSize, 'createdAt:DESC', search);
            if (result) {
                setPaging(result);
            }
        } catch (error) {
            onError(error.message || 'Please check your internet connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const [paging, setPaging] = useState(() => {
        return {
            currentPage: 0,
            pageSize: 12,
            total: 0,
            data: [],
        };
    });

    useEffect(() => {
        setChecked(selectedData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedData]);

    useEffect(() => {
        loadFiles(0, paging.pageSize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const handleClick = item => {
        if (!multi) {
            onClose(item);
            return;
        }

        const existIdx = checked.findIndex(x => x.id === item.id);
        const updateSelection = existIdx < 0 ? [...checked, item] : checked.filter(x => x.id !== item.id);

        setChecked(updateSelection);
        onSelectionChange(updateSelection);
    };

    return (
        <>
            <Dialog fullWidth maxWidth="lg" onEscapeKeyDown={() => onClose(false)} open={show} TransitionComponent={Transition}>
                <DialogTitle className={classes.header}>
                    <Grid container>
                        <Grid container item lg={4} md={4} sm={12} xs={12} alignItems="center" justify="flex-start">
                            <Typography color="primary" variant="h6" component="h1" noWrap>
                                {title}
                            </Typography>
                        </Grid>
                        <Grid container item lg={4} md={4} sm={8} xs={12} alignItems="center" justify="center" alignContent="flex-start">
                            <SearchInput onSearch={value => setSearch(value)} placeholder="Search Files" />
                        </Grid>
                        <Grid container item lg={4} md={4} sm={4} xs={12} alignItems="center" justify="flex-end">
                            <Tooltip title="Close Dialog">
                                <IconButton size="small" color="primary" onClick={() => onClose(false)} aria-label="Close">
                                    <Icon>close</Icon>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                    {loading ? <LinearProgress /> : <div className={classes.noLoading}></div>}
                </DialogTitle>
                <DialogContent className={classes.content}>
                    <Grid container spacing={3}>
                        {paging.data ? (
                            paging.data.map((item, index) => {
                                const isMarked = multi
                                    ? checked.findIndex(x => x.id === item.id) >= 0
                                    : checked && checked.id && checked.id === item.id;

                                return (
                                    <FileItem
                                        isMarked={isMarked}
                                        multi={multi}
                                        key={item.id + '-' + index}
                                        onClick={() => handleClick(item)}
                                        {...item}
                                    />
                                );
                            })
                        ) : (
                            <p align="center">There is no file.</p>
                        )}
                    </Grid>
                </DialogContent>
                <Table>
                    <TableFooter>
                        <TableRow>
                            <PaginationBar
                                rowsPerPage={[12, 24, 36]}
                                total={paging.total}
                                pageSize={paging.pageSize}
                                currentPage={paging.currentPage}
                                onPageChange={newPage => loadFiles(newPage, paging.pageSize)}
                                onPageSizeChange={size => loadFiles(0, size)}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
                {multi ? (
                    <DialogActions>
                        <Button onClick={() => onClose(true)} color="primary" variant="contained">
                            Ok
                        </Button>
                        <Button onClick={() => onClose(false)} color="secondary" variant="contained">
                            Cancel
                        </Button>
                    </DialogActions>
                ) : null}
            </Dialog>
        </>
    );
};

FilePicker.defaultProps = {
    title: 'File Browser',
    selectedData: [],
    onError: error => console.warn(error),
    onSelectionChange: result => console.warn('Undefined onSelectionChange => ', result),
};

export default FilePicker;
