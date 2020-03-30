import React from 'react';
import { Fade, Dialog, DialogTitle, DialogContent, makeStyles } from '@material-ui/core';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Fade in ref={ref} {...props} />;
});

const styles = makeStyles(theme => ({
    container: {
        cursor: 'pointer',
        position: 'relative',
        border: '3px solid ' + theme.palette.primary.light,
        display: 'inline-flex',
        margin: theme.spacing(2, 0),
    },
    removeButton: {
        position: 'absolute',
        top: -12,
        right: -12,
        backgroundColor: theme.palette.error.main,
        color: 'white',
        padding: 0,
        width: 25,
        height: 25,
        fontSize: 12,
        border: 'none',
        cursor: 'pointer',
        borderRadius: 40,
    },
    hiddenInput: {
        display: 'none',
        zIndex: -9999,
        color: theme.palette.background.paper,
        backgroundColor: theme.palette.background.paper,
        border: 0,
    },
}));

type MultiUploadProps = {
    show: boolean,
    onClose: (result: Array<Object>) => void,
};

export const MultiUpload = (props: MultiUploadProps) => {
    const { show, onClose } = props;
    const classes = styles();
    const [files, setFiles] = React.useState([]);
    const inputUpload = React.createRef();

    const handleUpload = event => {
        const files = event.target.files;
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileReader = new FileReader();
                fileReader.onload = () => {};
                fileReader.readAsDataURL(file);
            }
        }
    };

    return (
        <Dialog maxWidth="lg" open={show} onEscapeKeyDown={() => onClose(false)} TransitionComponent={Transition}>
            <DialogTitle id="alert-dialog-title">Upload Files</DialogTitle>
            <DialogContent>
                <img onClick={() => inputUpload.current.click()} src="./images/upload.png" alt={'Uploaded Image'} />
                <input style={{ display: 'none' }} multiple accept="image/*" type="file" onChange={handleUpload} ref={inputUpload} />
            </DialogContent>
        </Dialog>
    );
};
