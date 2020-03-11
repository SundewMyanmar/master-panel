import React, { useState, createRef, useEffect } from 'react';
import { InputProps, IconButton, makeStyles, Icon } from '@material-ui/core';
import ListPicker from './ListPicker';
import FileApi from '../../api/FileApi';
import FilePicker from './FilePicker';
import { AlertDialog } from '../message';

type ImageSize = {
    width: Number,
    height: Number,
};

type ImageInputProps = {
    ...InputProps,
    size: ?ImageSize,
    onUpload: ?Function,
    onRemove: ?Function,
    enableFilePicker?: Boolean,
    disabledUpload?: Boolean,
    disabledRemove?: Boolean,
    value: Object | String,
    onChange(image): Function,
};

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

const MENU_LIST_ITEMS = [
    {
        id: 'gallery',
        icon: 'photo',
        label: 'Choose From Gallery',
    },
    {
        id: 'upload',
        icon: 'cloud_upload',
        label: 'Upload New Image',
    },
];

const ImagePicker = (props: ImageInputProps) => {
    const classes = styles();
    const { id, name, size, value, enableFilePicker, disabledUpload, disabledRemove, onChange, required, ...rest } = props;

    const [showMenu, setShowMenu] = useState(false);
    const [showFile, setShowFile] = useState(false);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState('');
    const [image, setImage] = useState(value);
    const inputUpload = createRef();

    useEffect(() => {
        const imageURL = FileApi.downloadLink(value);
        if (imageURL !== preview && inputUpload.current) {
            handleChange(value, imageURL);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleChange = (result, url) => {
        setPreview(url);
        setImage(result);

        if (onChange) {
            onChange({
                target: {
                    name: id || name,
                    value: result,
                },
            });
        }
    };

    const handleImageClick = () => {
        if (!disabledUpload && enableFilePicker) {
            setShowMenu(true);
        } else if (disabledUpload && enableFilePicker) {
            setShowFile(true);
        } else if (!enableFilePicker) {
            inputUpload.current.click();
        }
    };

    const handleCloseMenu = item => {
        if (item.id === 'gallery') {
            setShowFile(true);
        } else if (item.id === 'upload') {
            inputUpload.current.click();
        }

        setShowMenu(false);
    };

    const handleCloseFile = result => {
        setShowFile(false);
        if (result === false) {
            return;
        }
        const url = FileApi.downloadLink(result);
        handleChange(result, url);
    };

    const handleError = error => {
        setShowFile(false);
        setShowMenu(false);
        setError(error);
    };

    const handleImageChange = event => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            var fileReader = new FileReader();
            fileReader.onload = () => {
                handleChange(file, fileReader.result);
            };
            fileReader.readAsDataURL(file);
        }
    };

    const handleRemove = event => {
        handleChange(null, null);
    };

    const visibility = !disabledRemove && preview ? 'visible' : 'hidden';

    const img = preview ? preview : './images/upload.png';

    return (
        <>
            <AlertDialog onClose={() => setError('')} show={error.length > 0} title="Error" message={error} />
            <FilePicker show={showFile} selectedData={image} onClose={handleCloseFile} onError={handleError} title="Choose File" />
            <ListPicker show={showMenu} onClose={handleCloseMenu} data={MENU_LIST_ITEMS} title="Choose Action" />
            <div className={[classes.container]}>
                <IconButton style={{ visibility: visibility }} onClick={handleRemove} className={classes.removeButton}>
                    <Icon>close</Icon>
                </IconButton>
                <img
                    onClick={handleImageClick}
                    src={img}
                    alt={preview && preview.id ? preview.name : 'Uploaded Image'}
                    style={{
                        maxWidth: size.width,
                        maxHeight: size.height,
                        width: 'auto',
                        height: 'auto',
                    }}
                />
                <input
                    className={classes.hiddenInput}
                    id={id || name}
                    name={name || id}
                    accept="image/*"
                    type="file"
                    onChange={handleImageChange}
                    ref={inputUpload}
                    {...rest}
                />
            </div>
        </>
    );
};

ImagePicker.defaultProps = {
    size: { width: 128, height: 128 },
    enableFilePicker: false,
    disabledUpload: false,
    disabledRemove: false,
};

export default ImagePicker;
