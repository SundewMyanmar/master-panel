import React from 'react';
import { useDropzone } from 'react-dropzone';
import {
    Fade,
    Dialog,
    makeStyles,
    Typography,
    Container,
    DialogActions,
    Button,
    Icon,
    Grid,
    Divider,
    IconButton,
    MuiThemeProvider,
    Checkbox,
    FormControlLabel,
    Tooltip,
} from '@material-ui/core';
import { ErrorTheme } from '../../config/Theme';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Fade in ref={ref} {...props} />;
});

const styles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(1),
    },
    container: {
        minHeight: 120,
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        outline: 'none',
        color: theme.palette.action.disabled,
        transition: 'border .24s ease-in-out',
        border: '2px dashed ' + theme.palette.info.main,
        background: theme.palette.background.default,
        cursor: 'pointer',
        marginBottom: theme.spacing(1),
    },
    thumbnailContainer: {
        border: '1px solid ' + theme.palette.divider,
        padding: theme.spacing(1),
        borderRadius: 4,
        backgroundColor: theme.palette.background.default,
        position: 'relative',
    },
    thumbnail: {
        maxWidth: 128,
        maxHeight: 128,
        width: 'auto',
        height: 'auto',
    },
    removeButton: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        padding: 0,
        width: '25',
        height: 25,
        fontSize: 12,
        border: 'none',
        cursor: 'pointer',
        borderRadius: 40,
    },
}));

type MultiUploadProps = {
    show: boolean,
    accept: string,
    onClose: (result: Array<Object>) => void,
};

export const MultiUpload = (props: MultiUploadProps) => {
    const { show, accept, onClose } = props;
    const classes = styles();
    const [files, setFiles] = React.useState([]);
    const [isPublic, setIsPublic] = React.useState(true);
    const [isHidden, setIsHidden] = React.useState(false);

    const handlePublicChange = event => {
        setIsPublic(event.target.checked);
    };

    const handleHiddenChange = event => {
        setIsHidden(event.target.checked);
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: accept,
        onDrop: acceptedFiles => {
            const newFiles = acceptedFiles.map((file, idx) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                    id: idx + '-' + file.name,
                }),
            );
            setFiles([...files, ...newFiles]);
        },
    });

    React.useEffect(
        () => () => {
            // Make sure to revoke the data uris to avoid memory leaks
            files.forEach(file => {
                if (file.preview) {
                    URL.revokeObjectURL(file.preview);
                }
            });
        },
        [files],
    );

    const handleClose = status => {
        const uploadFiles = files.map(file => {
            URL.revokeObjectURL(file.preview);
            delete file.preview;
            return file;
        });
        if (status) {
            onClose(uploadFiles, isPublic, isHidden);
        } else {
            onClose(false);
        }
        setFiles([]);
    };

    const handleRemove = file => {
        // Make sure to revoke the data uris to avoid memory leaks
        URL.revokeObjectURL(file.preview);
        const updatedFiles = files.filter(f => f.id !== file.id);
        console.log('Updated Files => ', updatedFiles);
        setFiles(updatedFiles);
    };

    return (
        <Dialog
            maxWidth="md"
            fullWidth
            open={show}
            onClose={() => handleClose(false)}
            TransitionComponent={Transition}
        >
            <Container className={classes.root}>
                <div {...getRootProps({ className: classes.container })}>
                    <input {...getInputProps()} />
                    <Typography variant="h5" color="inherit">
                        Drag &amp; drop or click to upload files.
                    </Typography>
                </div>
                <Grid container spacing={1}>
                    {files.map((file, idx) => {
                        return (
                            <Grid key={file.id} container item justify="center" xs={4} sm={3} md={2} lg={2}>
                                <div className={classes.thumbnailContainer}>
                                    <img className={classes.thumbnail} src={file.preview} alt={file.name} />
                                    <MuiThemeProvider theme={ErrorTheme}>
                                        <Tooltip title="Remove" aria-label="remove">
                                            <IconButton onClick={() => handleRemove(file)} className={classes.removeButton}>
                                                <Icon color="primary">delete</Icon>
                                            </IconButton>
                                        </Tooltip>
                                    </MuiThemeProvider>
                                </div>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
            <Divider />
            <DialogActions>
                <FormControlLabel
                    control={<Checkbox color="primary" checked={isPublic} onChange={handlePublicChange} name="isPublic" />}
                    label="Public?"
                />
                <FormControlLabel
                    control={<Checkbox color="primary" checked={isHidden} onChange={handleHiddenChange} name="isHidden" />}
                    label="Hidden?"
                />
                <Button onClick={() => handleClose(true)} variant="contained" color="primary">
                    <Icon>done</Icon> Ok
                </Button>
                <Button onClick={() => handleClose(false)} variant="contained" color="default">
                    <Icon>done</Icon> Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

MultiUpload.defaultProps = {
    accept: 'image/*',
    onClose: result => console.warn('Undefined onClose =>', result),
};
