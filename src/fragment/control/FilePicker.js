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
import FileGrid from '../file/FileGrid';

type FilePickerProps = {
    show: boolean,
    selectedData: Array<Object> | Object,
    multi: boolean,
    title?: string,
    currentPage?: number,
    pageSize?: number,
    total?: number,
    onError(error: Object | string): ?Function,
    onSelectionChange(result: Object | boolean): ?Function,
    onClose(result: Object | Array<Object>): Function,
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom in ref={ref} {...props} />;
});

const styles = makeStyles(theme => ({
    content: {
        backgroundColor: theme.palette.background.default,
        borderTop: '1px solid ' + theme.palette.divider,
        borderBottom: '1px solid ' + theme.palette.divider,
        padding: theme.spacing(1),
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
            onError(error.message || error.title || 'Please check your internet connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const [paging, setPaging] = useState(() => {
        return {
            currentPage: 0,
            pageSize: 24,
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
                    <FileGrid data={paging.data} selectedData={checked} onClickItem={handleClick} />
                </DialogContent>
                <Table>
                    <TableFooter>
                        <TableRow>
                            <PaginationBar
                                rowsPerPage={[12, 24, 36, 72]}
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
                            <Icon>done</Icon> Ok
                        </Button>
                        <Button onClick={() => onClose(false)} color="default" variant="contained">
                            <Icon>close</Icon> Cancel
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
