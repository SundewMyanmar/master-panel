import React from 'react';
import { withRouter } from 'react-router';
import { QuestionDialog } from '../message';
import TreeMenu from '../layout/TreeMenu';
import {
    Grid,
    Paper,
    Container,
    Avatar,
    Icon,
    Typography,
    Button,
    makeStyles,
    Table,
    TableFooter,
    TableRow,
    Menu,
    MenuItem,
    Checkbox,
    ListItemText,
} from '@material-ui/core';
import { SearchInput } from '../control';
import PaginationBar from '../PaginationBar';
import FolderApi from '../../api/FolderApi';
import FileApi from '../../api/FileApi';
import ImagePreview from './ImagePreview';
import FileGrid from './FileGrid';
import FolderDialog from '../control/FolderDialog';
import { MultiUpload } from './MultiUpload';
import { useDispatch } from 'react-redux';
import { ALERT_REDUX_ACTIONS } from '../../util/AlertManager';
import { FLASH_REDUX_ACTIONS } from '../../util/FlashManager';

const styles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        padding: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        padding: theme.spacing(3),
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
    treeBox: {
        overflow: 'auto',
        minHeight: 480,
        background: theme.palette.background.default,
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        border: '1px solid ' + theme.palette.divider,
        flex: 1,
    },
    innerBox: {
        marginTop: theme.spacing(2),
    },
    content: {
        paddingLeft: theme.spacing(1),
    },
    submit: {
        marginLeft: theme.spacing(1),
    },
    remove: {
        background: theme.palette.error.main,
        marginLeft: theme.spacing(1),
        color: theme.palette.error.contrastText,
        '&:hover': {
            background: theme.palette.error.dark,
        },
    },
    container: {
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(1.5, 1),
        margin: theme.spacing(1, 0),
    },
    footer: {
        backgroundColor: 'transparent',
    },
}));

const ITEM_HEIGHT = 48;

const FileManager = (props) => {
    const classes = styles();
    const dispatch = useDispatch();

    const { onClose } = props;
    const [question, setQuestion] = React.useState('');
    const [search, setSearch] = React.useState('');
    const [paging, setPaging] = React.useState(() => {
        return {
            currentPage: 0,
            pageSize: 24,
            total: 0,
            sort: 'createdAt:DESC',
        };
    });
    const [showRoot, setShowRoot] = React.useState(false);
    const [removeType, setRemoveType] = React.useState(null);
    const [removeData, setRemoveData] = React.useState(null);
    const [preview, setPreview] = React.useState(null);
    const [showUploadDialog, setShowUploadDialog] = React.useState(false);
    const [files, setFiles] = React.useState([]);

    const [folder, setFolder] = React.useState({});
    const [folders, setFolders] = React.useState([]);
    const [showFolder, setShowFolder] = React.useState(false);

    const [showPublic, setShowPublic] = React.useState(true);
    const [showHidden, setShowHidden] = React.useState(false);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const loadFiles = async (folder, currentPage, pageSize, sort) => {
        dispatch({ type: ALERT_REDUX_ACTIONS.SHOW_LOADING });
        try {
            const result = await FileApi.getPagingByFolder(folder, currentPage, pageSize, sort, search, showPublic, showHidden);
            const { data, ...paging } = result;
            setPaging(paging);
            console.log('file data', result);
            setFiles(data);
        } catch (error) {
            handleError(error);
        }
        dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
    };

    const loadFolders = async () => {
        dispatch({ type: ALERT_REDUX_ACTIONS.SHOW_LOADING });
        try {
            const result = await FolderApi.getTree('');
            let resultData = [];
            if (result && result.data) {
                resultData = modifyFolders(result.data);
            }
            setFolders(result.data);
        } catch (error) {
            handleError(error);
        }
        dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
    };

    const modifyFolders = (items) => {
        let newItems = [];
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (item.items && item.items.length > 0) {
                item.items = modifyFolders(item.items);
            }

            if (item.icon === 'default') item.icon = 'folder';
            item.label = item.name;
            newItems.push(item);
        }
        return newItems;
    };

    React.useEffect(() => {
        setShowRoot(folder.id);
    }, [folder]);

    React.useEffect(() => {
        loadFiles(folder.id, 0, paging.pageSize, paging.sort);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showPublic, showHidden]);

    React.useEffect(() => {
        loadFiles(folder.id, 0, paging.pageSize, paging.sort);
        loadFolders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const handleFolderSubmit = (form) => {
        console.log('submit folder 1', form);
        if (!window.navigator.onLine) {
            handleError('Please check your internet connection and try again.');
            return;
        }

        dispatch({ type: ALERT_REDUX_ACTIONS.SHOW_LOADING });

        if (folder.id) {
            let data = {
                ...folder,
                name: form.name || folder.name,
                color: form.color || folder.color,
                icon: form.icon || folder.icon,
                priority: form.priority || folder.priority,
            };
            console.log('submit folder', data);
            //TODO: update
            FolderApi.modifyById(folder.id, data)
                .then((response) => {
                    console.log('submit folder res', response);
                    loadFolders();
                    dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
                    dispatch({
                        type: FLASH_REDUX_ACTIONS.SHOW,
                        flash: { type: 'success', message: 'Save success.' },
                    });
                })
                .catch(handleError);
        } else {
            let data = {
                ...folder,
                name: form.name || 'New Folder',
                color: form.color || '#000',
                icon: form.icon || 'folder',
                priority: form.priority || '0',
            };
            FolderApi.addNew(data)
                .then((response) => {
                    loadFolders();
                    dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
                    dispatch({
                        type: FLASH_REDUX_ACTIONS.SHOW,
                        flash: { type: 'success', message: 'Save success.' },
                    });
                })
                .catch(handleError);
        }

        setShowFolder(false);
    };

    const handleTreeCreate = (item) => {
        console.log('tree create', item);
        let f = item.id ? item : {};
        if (item.parentId) f.parentId = item.parentId;
        setFolder(f);
        setShowFolder(true);
    };

    const handleFolderClick = (item) => {
        console.log('tree click', item.id, item.name, item.color);
        setFolder(item.id ? item : {});
        loadFiles(item.id, 0, paging.pageSize, paging.sort);
    };

    const handleError = (error) => {
        dispatch({
            type: ALERT_REDUX_ACTIONS.SHOW,
            alert: error || 'Please check your internet connection and try again.',
        });
    };

    const handleQuestionDialog = (status) => {
        if (status) {
            if (removeType == 'file') {
                dispatch({ type: ALERT_REDUX_ACTIONS.SHOW_LOADING });
                FileApi.removeById(removeData.id)
                    .then((response) => {
                        loadFiles(folder.id, 0, paging.pageSize, paging.sort);
                        dispatch({
                            type: FLASH_REDUX_ACTIONS.SHOW,
                            flash: { type: 'success', message: 'Delete success.' },
                        });
                        dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
                    })
                    .catch(handleError);
            } else if (removeType == 'folder') {
                dispatch({ type: ALERT_REDUX_ACTIONS.SHOW_LOADING });
                FolderApi.removeById(removeData.id)
                    .then((response) => {
                        loadFolders();
                        loadFiles(null, 0, paging.pageSize, paging.sort);
                        setFolder({});
                        dispatch({
                            type: FLASH_REDUX_ACTIONS.SHOW,
                            flash: { type: 'success', message: 'Delete success.' },
                        });
                        dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
                    })
                    .catch(handleError);
            }
        }

        setQuestion('');
        setRemoveData(null);
        setRemoveType(null);
    };

    const handleUpload = (result, isPublic, isHidden) => {
        if (result && result.length > 0) {
            let folderId = null;
            if (folder && folder.id) {
                folderId = folder.id;
            }

            dispatch({ type: ALERT_REDUX_ACTIONS.SHOW_LOADING });
            FileApi.upload(result, isPublic, isHidden, folderId)
                .then((response) => {
                    console.log('upload', response);
                    loadFiles(folder.id, 0, paging.pageSize, paging.sort);
                    dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
                })
                .catch(handleError);
        }
        setShowUploadDialog(false);
    };

    const handleFileClick = (file) => {
        if (onClose) {
            onClose(file);
            return;
        }

        setPreview(file);
    };

    const handleClosePreview = () => {
        setPreview(null);
    };

    const handleFolderRemove = (folder) => {
        setRemoveType('folder');
        setRemoveData(folder);
        setQuestion('Are you sure to remove folder : ' + folder.name + "? Folder Remove can't be undone.");
    };

    const handleFileUpdate = (file) => {
        dispatch({ type: ALERT_REDUX_ACTIONS.SHOW_LOADING });
        FileApi.modifyById(file.id, file)
            .then((response) => {
                loadFiles(folder.id, 0, paging.pageSize, paging.sort);
                dispatch({
                    type: FLASH_REDUX_ACTIONS.SHOW,
                    flash: { type: 'success', message: 'Save success.' },
                });
                dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
            })
            .catch(handleError);
    };

    const handleFileRemove = (file) => {
        setRemoveType('file');
        setRemoveData(file);
        setQuestion('Are you sure to remove file : ' + file.name + '.' + file.extension + ' ?');
    };

    return (
        <>
            <QuestionDialog show={question.length > 0} title="Confirm?" message={question} onClose={handleQuestionDialog} />
            <MultiUpload show={showUploadDialog} onClose={handleUpload} />
            <FolderDialog data={folder} show={showFolder} onShow={setShowFolder} onSubmit={handleFolderSubmit}></FolderDialog>
            {preview ? (
                <ImagePreview
                    show={preview != null}
                    data={preview}
                    folders={folders}
                    folder={folder}
                    onUpdate={handleFileUpdate}
                    onRemove={handleFileRemove}
                    onClose={handleClosePreview}
                />
            ) : null}

            <Grid className={classes.innerBox} container>
                <Grid container item lg={3} md={4} sm={12} xs={12} className={classes.treeBox}>
                    <TreeMenu
                        allowCreate={true}
                        onCreate={handleTreeCreate}
                        onRemove={handleFolderRemove}
                        menus={folders}
                        showRoot={showRoot}
                        onClickItem={handleFolderClick}
                    />
                </Grid>
                <Grid className={classes.content} container item lg={9} md={8} sm={12} xs={12} justifyContent="flex-start" alignContent="center">
                    <Grid container justifyContent="flex-start" alignContent="center" direction="row" item spacing={1}>
                        <Grid item lg={9} md={7} sm={6} xs={12}>
                            <SearchInput onSearch={(value) => setSearch(value)} placeholder="Search Files" />
                        </Grid>
                        <Grid container item lg={1} md={2} sm={3} xs={12} justifyContent="center" alignContent="center">
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                aria-label="more"
                                aria-controls="long-menu"
                                aria-haspopup="true"
                                onClick={handleClick}
                            >
                                <Icon>tune</Icon>
                            </Button>
                            <Menu
                                id="long-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={open}
                                onClose={handleClose}
                                PaperProps={{
                                    style: {
                                        maxHeight: ITEM_HEIGHT * 4.5,
                                        width: '20ch',
                                    },
                                }}
                            >
                                <MenuItem key="public" value={showPublic}>
                                    <Checkbox
                                        color="secondary"
                                        value={showPublic}
                                        onChange={(event) => setShowPublic(event.target.checked)}
                                        checked={showPublic}
                                    />
                                    <ListItemText primary="Public" />
                                </MenuItem>
                                <MenuItem key="hidden" value={showHidden}>
                                    <Checkbox
                                        color="secondary"
                                        value={showHidden}
                                        onChange={(event) => setShowHidden(event.target.checked)}
                                        checked={showHidden}
                                    />
                                    <ListItemText primary="Hidden" />
                                </MenuItem>
                            </Menu>
                        </Grid>
                        <Grid container item lg={2} md={3} sm={3} xs={12} justifyContent="flex-end" alignContent="center">
                            <Button fullWidth onClick={() => setShowUploadDialog(true)} variant="contained" color="primary" aria-label="Upload">
                                <Icon className={classes.icon}>cloud_upload</Icon> Upload
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container item>
                        <FileGrid className={classes.container} data={files} onClickItem={handleFileClick} />
                        <Table className={classes.footer}>
                            <TableFooter>
                                <TableRow>
                                    <PaginationBar
                                        rowsPerPage={[12, 24, 36, 72]}
                                        total={paging.total}
                                        pageSize={paging.pageSize}
                                        currentPage={paging.currentPage}
                                        onPageChange={(newPage) => loadFiles(folder.id, newPage, paging.pageSize, paging.sort)}
                                        onPageSizeChange={(size) => loadFiles(folder.id, 0, size, paging.sort)}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default withRouter(FileManager);
