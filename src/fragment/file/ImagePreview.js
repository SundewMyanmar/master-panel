import React from 'react';
import {
    Dialog,
    IconButton,
    Icon,
    Divider,
    CardContent,
    Typography,
    Grid,
    CardActions,
    Button,
    makeStyles,
    Fade,
    MuiThemeProvider,
} from '@material-ui/core';
import { ErrorTheme } from '../../config/Theme';
import FileApi from '../../api/FileApi';

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

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Fade in ref={ref} {...props} />;
});

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
}));

type ImagePreviewProps = {
    show: boolean,
    data: Object,
    onClose?: () => void,
    onRemove?: (file: Object) => void,
};

const ImagePreview = (props: ImagePreviewProps) => {
    const { show, data, onClose, onRemove } = props;
    const [dimension, setDimension] = React.useState(data.size);
    const isImage = data.type.startsWith('image');
    const url = FileApi.downloadLink(data) || '/res/default-image.png';

    const handleImageLoading = ({ target: img }) => {
        setDimension(img.naturalWidth + ' x ' + img.naturalHeight);
    };

    const classes = style();

    const handleRemove = () => {
        onClose();
        if (onRemove) {
            onRemove(data);
        }
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
            <div className={classes.root}>
                <IconButton className={classes.buttonClose} size="small" color="primary" onClick={() => onClose(false)} aria-label="Close">
                    <Icon>close</Icon>
                </IconButton>
                <img onLoad={handleImageLoading} width="100%" height="100%" src={url} alt={data.name} />
            </div>
            <Divider />
            <CardContent>
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
            </CardContent>
            {onRemove ? (
                <CardActions style={{ justifyContent: 'flex-end' }}>
                    <MuiThemeProvider theme={ErrorTheme}>
                        <Button color="primary" variant="contained" onClick={handleRemove}>
                            Delete
                        </Button>
                    </MuiThemeProvider>
                </CardActions>
            ) : null}
        </Dialog>
    );
};

ImagePreview.defaultProps = {
    onClose: () => console.warn('Undefined onClose'),
};

export default ImagePreview;
