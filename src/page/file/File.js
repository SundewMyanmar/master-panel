import React from 'react';
import { withRouter } from 'react-router';
import { Typography, makeStyles, Paper, Icon, Grid, Button, Table, TableFooter, TableRow, TableContainer } from '@material-ui/core';
import { Notification, AlertDialog, QuestionDialog, LoadingDialog } from '../../fragment/message';
import { SearchInput } from '../../fragment/control';
import PaginationBar from '../../fragment/PaginationBar';
import FileApi from '../../api/FileApi';
import ImagePreview from '../../fragment/file/ImagePreview';
import FileGrid from '../../fragment/file/FileGrid';
import { MultiUpload } from '../../fragment/file/MultiUpload';

const styles = makeStyles((theme) => ({
    header: {
        flex: 1,
        borderBottom: '1px solid ' + theme.palette.divider,
        padding: theme.spacing(1),
    },
    container: {
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(1.5, 1),
    },
    footer: {
        backgroundColor: 'transparent',
    },
    icon: {
        marginRight: theme.spacing(0.5),
    },
    newButton: {
        marginLeft: theme.spacing(1),
    },
    deleteButton: {
        color: theme.palette.error.main,
        '&:hover': {
            color: theme.palette.error.dark,
        },
    },
    editButton: {
        color: theme.palette.secondary.main,
        '&:hover': {
            color: theme.palette.secondary.dark,
        },
    },
}));

const File = () => {
    const classes = styles();

    const [loading, setLoading] = React.useState(false);
    const [question, setQuestion] = React.useState('');
    const [error, setError] = React.useState('');
    const [noti, setNoti] = React.useState('');
    const [search, setSearch] = React.useState('');
    const [data, setData] = React.useState([]);
    const [removeData, setRemoveData] = React.useState(null);
    const [preview, setPreview] = React.useState(null);
    const [showUploadDialog, setShowUploadDialog] = React.useState(false);

    const handleError = (error) => {
        setError(error.message || error.title || 'Please check your internet connection and try again.');
        setLoading(false);
    };

    const loadData = async (currentPage, pageSize, sort) => {
        setLoading(true);
        try {
            const result = await FileApi.getPaging(currentPage, pageSize, sort, search);
            const { data, ...paging } = result;
            setData(data);
            setPaging(paging);
        } catch (error) {
            handleError(error);
        }
        setLoading(false);
    };

    const [paging, setPaging] = React.useState(() => {
        return {
            currentPage: 0,
            pageSize: 24,
            total: 0,
            sort: 'createdAt:DESC',
        };
    });

    React.useEffect(() => {
        loadData(0, paging.pageSize, paging.sort);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const handleRemove = (file) => {
        setRemoveData(file);
        setQuestion('Are you sure to remove file : ' + file.name + '.' + file.extension + ' ?');
    };

    const handleItemClick = (file) => {
        setPreview(file);
    };

    const handleClosePreview = () => {
        setPreview(null);
    };

    //Remove Data if confirmation is Yes
    const handleQuestionDialog = (status) => {
        if (status && removeData) {
            setLoading(true);
            FileApi.removeById(removeData.id)
                .then(() => {
                    loadData(0, paging.pageSize, paging.sort);
                })
                .catch(handleError);
        }
        setQuestion('');
        setRemoveData(null);
    };

    const handleUpload = (result) => {
        if (result && result.length > 0) {
            setLoading(true);
            FileApi.upload(result, false)
                .then(() => {
                    loadData(0, paging.pageSize, paging.sort);
                })
                .catch(handleError);
        }
        setShowUploadDialog(false);
    };

    return (
        <>
            <Notification show={noti.length > 0} onClose={() => setNoti(false)} type="success" message={noti} />
            <AlertDialog onClose={() => setError('')} show={error.length > 0} title="Error" message={error} />
            <QuestionDialog show={question.length > 0} title="Confirm?" message={question} onClose={handleQuestionDialog} />
            <LoadingDialog show={loading} />
            <MultiUpload show={showUploadDialog} onClose={handleUpload} />
            {preview ? <ImagePreview show={preview != null} data={preview} onRemove={handleRemove} onClose={handleClosePreview} /> : null}
            <Paper className={classes.root} elevation={6}>
                <Grid container className={classes.header}>
                    <Grid container item lg={4} md={4} sm={6} xs={12} justifyContent="flex-start" alignContent="center">
                        <Typography color="primary" variant="h6" component="h1" noWrap>
                            File Manager
                        </Typography>
                    </Grid>
                    <Grid container item lg={4} md={4} sm={6} xs={12} alignItems="center" justifyContent="center">
                        <SearchInput onSearch={(value) => setSearch(value)} placeholder="Search Files" />
                    </Grid>
                    <Grid container item lg={4} md={4} sm={12} xs={12} alignContent="center" justifyContent="flex-end">
                        <Button
                            onClick={() => setShowUploadDialog(true)}
                            variant="contained"
                            color="primary"
                            aria-label="Add New"
                            className={classes.newButton}
                        >
                            <Icon className={classes.icon}>cloud_upload</Icon> File Upload
                        </Button>
                    </Grid>
                </Grid>
                <TableContainer>
                    <FileGrid className={classes.container} data={data} onClickItem={handleItemClick} />
                    <Table className={classes.footer}>
                        <TableFooter>
                            <TableRow>
                                <PaginationBar
                                    rowsPerPage={[12, 24, 36, 72]}
                                    total={paging.total}
                                    pageSize={paging.pageSize}
                                    currentPage={paging.currentPage}
                                    onPageChange={(newPage) => loadData(newPage, paging.pageSize)}
                                    onPageSizeChange={(size) => loadData(0, size)}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    );
};

export default withRouter(File);
