import React from 'react';
import {
    Dialog,
    IconButton,
    Icon,
    Divider,
    Typography,
    Grid,
    Tooltip,
    Button,
    makeStyles,
    Fade,
    MuiThemeProvider,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControlLabel,
    Checkbox,
    FormControl,
    Input,
    InputLabel,
    Select,
    MenuItem,
} from '@material-ui/core';
import { ErrorTheme } from '../../config/Theme';
import FileApi from '../../api/FileApi';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Fade in ref={ref} {...props} />;
});

const FileInfoField = props => {
    const { label, value, ...rest } = props;
    return (
        <Grid container {...rest}>
            <Grid container item xs={3}>
                <Typography variant="caption">{label}</Typography>
            </Grid>
            <Grid container item xs={9}>
                <Typography variant="subtitle2">: {value}</Typography>
            </Grid>
        </Grid>
    );
};

const style = makeStyles(theme => ({
    root: {
        padding: theme.spacing(0.5),
        position: 'relative',
    },
    buttonClose: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    formControl: {
        marginTop: 0,
        minWidth: 120,
    },
    checkbox: {
        marginTop: theme.spacing(2),
    },
    actionBar: {
        margin: theme.spacing(1),
        justifyContent: 'flex-end',
    },
}));

type ImagePreviewProps = {
    show: boolean,
    folder: Object,
    folders: Array,
    data: Object,
    onClose?: () => void,
    onUpdate?: (file: object) => void,
    onRemove?: (file: Object) => void,
};

const ImagePreview = (props: ImagePreviewProps) => {
    const { show, data, folder, folders, onClose, onRemove, onUpdate } = props;
    const [dimension, setDimension] = React.useState(data.size);
    const isImage = data.type.startsWith('image');
    const url = FileApi.downloadLink(data, 'large') || '/res/default-image.png';
    const [isPublic, setIsPublic] = React.useState(true);
    const [isHidden, setIsHidden] = React.useState(false);
    const [selectedFolder, setSelectedFolder] = React.useState(null);
    const [newFolders, setNewFolders] = React.useState([]);

    const handleFolderChange = event => {
        setSelectedFolder(event.target.value);
    };

    const handlePublicChange = event => {
        setIsPublic(event.target.checked);
    };

    const handleHiddenChange = event => {
        setIsHidden(event.target.checked);
    };

    const handleImageLoading = ({ target: img }) => {
        setDimension(img.naturalWidth + ' x ' + img.naturalHeight);
    };

    const classes = style();

    const handleSave = () => {
        onClose();
        //TODO: save
        if (onUpdate) {
            let updateData = {
                ...data,
                status: isHidden ? 'HIDDEN' : 'STORAGE',
                publicAccess: isPublic,
            };
            if (selectedFolder) {
                updateData.folder = {
                    id: selectedFolder.id,
                };
            } else {
                updateData.folder = null;
            }

            onUpdate(updateData);
        }
    };

    const handleRemove = () => {
        onClose();
        if (onRemove) {
            onRemove(data);
        }
    };

    const modifyFolders = (prefix, fs) => {
        let newFs = [];
        for (let i = 0; i < fs.length; i++) {
            let name = fs[i].name;
            if (prefix) {
                name = `${prefix} > ${name}`;
            }
            newFs.push({
                ...fs[i],
                fullName: name,
            });

            let itemArrays = modifyFolders(name, fs[i].items);
            newFs = [...newFs, ...itemArrays];
        }
        return newFs;
    };

    React.useEffect(() => {
        setIsPublic(data.publicAccess);
        setIsHidden(data.status == 'HIDDEN');
    }, [data]);

    React.useEffect(() => {
        let newArrays = modifyFolders(null, folders);
        setNewFolders(newArrays);

        let selected = null;
        for (let i = 0; i < newArrays.length; i++) {
            if (folder && folder.id == newArrays[i].id) selected = newArrays[i];
        }
        setSelectedFolder(selected);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [folders, folder]);

    const renderFolders = () => {
        return (
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Folder</InputLabel>
                <Select labelId="demo-simple-select-label" id="demo-simple-select" value={selectedFolder} onChange={handleFolderChange}>
                    <MenuItem key={'default'} value={null}>
                        (None)
                    </MenuItem>
                    {newFolders.map(item => {
                        return (
                            <MenuItem key={item.id} value={item}>
                                {item.fullName}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        );
    };

    return (
        <Dialog
            onEscapeKeyDown={onClose}
            open={show}
            TransitionComponent={Transition}
            onClose={onClose}
            aria-labelledby="image-preview-dialog"
            aria-describedby={data.name}
        >
            <DialogTitle>
                <Grid container>
                    <Grid container item lg={11} md={11} sm={11} xs={11} alignItems="center" justifyContent="flex-start">
                        <Typography color="inherit" variant="h6" component="h1" noWrap>
                            File Preview
                        </Typography>
                    </Grid>
                    <Grid container item lg={1} md={1} sm={1} xs={1} alignItems="center" justifyContent="flex-end">
                        <Tooltip title="Close Dialog">
                            <IconButton size="small" color="inherit" onClick={() => onClose(false)} aria-label="Close">
                                <Icon>close</Icon>
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <img onLoad={handleImageLoading} width="100%" height="100%" src={url} alt={data.name} />
                {data ? (
                    <Grid container>
                        <FileInfoField label="Name" value={data.name + '.' + data.extension} />
                        <FileInfoField label="Type" value={data.type} />
                        <FileInfoField label="Size" value={data.size} />
                        {isImage ? <FileInfoField label="Dimensions" value={dimension} /> : null}
                    </Grid>
                ) : (
                    <Typography variant="caption" align="center">
                        There is no image.
                    </Typography>
                )}
            </DialogContent>

            <DialogActions className={classes.actionBar}>
                {renderFolders()}
                <FormControlLabel
                    className={classes.checkbox}
                    control={<Checkbox color="primary" checked={isPublic} onChange={handlePublicChange} name="isPublic" />}
                    label="Public?"
                />
                <FormControlLabel
                    className={classes.checkbox}
                    control={<Checkbox color="primary" checked={isHidden} onChange={handleHiddenChange} name="isHidden" />}
                    label="Hidden?"
                />
                <Button onClick={handleSave} variant="contained">
                    <Icon>save</Icon> Save
                </Button>

                {onRemove ? (
                    <MuiThemeProvider theme={ErrorTheme}>
                        <Button color="primary" variant="contained" onClick={handleRemove}>
                            Delete
                        </Button>
                    </MuiThemeProvider>
                ) : null}
            </DialogActions>
        </Dialog>
    );
};

ImagePreview.defaultProps = {
    folder: null,
    folders: [],
    onClose: () => console.warn('Undefined onClose'),
};

export default ImagePreview;
