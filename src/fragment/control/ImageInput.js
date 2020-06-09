import React, { useState, createRef, useEffect } from 'react';
import { InputProps, IconButton, makeStyles, Icon } from '@material-ui/core';
import ListPicker from './ListPicker';
import FileApi from '../../api/FileApi';
import FilePicker from './FilePicker';
import { AlertDialog } from '../message';

type ImageSize = {
    width: number,
    height: number,
};

type ImageInputProps = {
    ...InputProps,
    size: ?ImageSize,
    onUpload: ?Function,
    onRemove: ?Function,
    enableFilePicker?: boolean,
    disabledUpload?: boolean,
    disabledRemove?: boolean,
    value: Object | string,
    onChange(image): Function,
};

const styles = makeStyles(theme => ({
    container: {
        cursor: 'pointer',
        position: 'relative',
        border: '3px solid ' + theme.palette.primary.light,
        display: 'inline-flex',
        margin: theme.spacing(2, 1),
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

//TODO: Fix Multi Image Picker
export const MultiImagePicker = props => {
    const { id, name, value, onChange, ...rest } = props;
    const [images, setImages] = useState(value);

    useEffect(() => {
        var imgs = value || [null];
        if (imgs[imgs.length - 1] !== null) imgs = [...imgs, null];
        setImages(imgs);
        setOnChange(imgs);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleOnChange = (event, index) => {
        var data = images;
        data[index] = event.target.value;

        if (index === data.length - 1 && event.target.value) data = [...data, null];

        setImages(data);
        setOnChange(data);
    };

    const setOnChange = data => {
        if (onChange)
            onChange({
                target: {
                    name: id || name,
                    value: data,
                },
            });
    };

    const handleOnRemove = (event, index) => {
        var data = images;
        data.splice(index, 1);

        if (data.length === 0 || data[data.length - 1] !== null) {
            data = [...data, null];
        }

        setImages(data);

        setOnChange(data);
    };

    return (
        <>
            {images &&
                images.map(img => (
                    <ImagePicker
                        id={id}
                        name={name}
                        key={`img-${img == null ? 'no-data' : images.indexOf(img)}`}
                        index={images.indexOf(img)}
                        value={img ? img.image : null}
                        onChange={handleOnChange}
                        onRemove={handleOnRemove}
                        {...rest}
                    />
                ))}
        </>
    );
};

const ImagePicker = (props: ImageInputProps) => {
    const classes = styles();
    const { id, index, name, size, value, enableFilePicker, disabledUpload, disabledRemove, onChange, onRemove, required, ...rest } = props;

    const [showMenu, setShowMenu] = useState(false);
    const [showFile, setShowFile] = useState(false);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState('');
    const [image, setImage] = useState(value);
    const inputUpload = createRef();

    useEffect(() => {
        const imageURL = FileApi.downloadLink(value, 'small');
        if (imageURL !== preview && inputUpload.current) {
            handleChange(value, imageURL);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleChange = (result, url) => {
        setPreview(url);
        setImage(result);

        if (onChange) {
            var obj = {
                target: {
                    id: id || name,
                    name: id || name,
                    value: result,
                    type: 'image',
                    url: url,
                },
            };
            console.log('img input', obj);
            onChange(obj, index);
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

        const url = FileApi.downloadLink(result, 'small');
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
            const fileReader = new FileReader();
            fileReader.onload = () => {
                handleChange(file, fileReader.result);
            };
            fileReader.readAsDataURL(file);
        }
    };

    const handleRemove = event => {
        handleChange(null, null);
        if (onRemove) onRemove(index);
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
