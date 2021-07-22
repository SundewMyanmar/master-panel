import React, { useState, createRef, useEffect } from 'react';
import { InputProps, IconButton, makeStyles, Icon } from '@material-ui/core';
import ListPicker from './ListPicker';
import FileApi from '../../api/FileApi';
import FileManagerPicker from '../file/FileManagerPicker';
import { useDispatch } from 'react-redux';
import { ALERT_REDUX_ACTIONS } from '../../util/AlertManager';

type ImageSize = {
    width: number,
    height: number,
};

type ImageInputProps = {
    ...InputProps,
    size: ?ImageSize,
    enableFilePicker?: boolean,
    disabledUpload?: boolean,
    disabledRemove?: boolean,
    value: Object | string,
    onUpload?: () => void,
    onRemove?: () => void,
    onChange: (image: Object | string) => void,
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
    moveButton: {
        position: 'absolute',
        bottom: -12,
        left: '45%',
        backgroundColor: theme.palette.primary.main,
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
    image: {
        backgroundColor: theme.palette.common.lightGray,
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
    const { id, index, name, size, value, enableFilePicker, disabledUpload, disabledRemove, onChange, onRemove, required, ...rest } = props;
    const dispatch = useDispatch();

    const [showMenu, setShowMenu] = useState(false);
    const [showFile, setShowFile] = useState(false);
    const [preview, setPreview] = useState('');
    const [image, setImage] = useState(value);
    const inputUpload = createRef();

    useEffect(() => {
        const imageURL = FileApi.downloadLink(value, 'small');

        if (imageURL && imageURL !== preview && inputUpload.current) {
            handleChange(value, imageURL);
        } else {
            if (value && Object.entries(value).length === 0) {
                setPreview(null);
                setImage(null);
            } else {
                if (value && value.target) {
                    setPreview(value.target.url);
                    setImage(value);
                } else if (!value) {
                    setPreview(null);
                    setImage(null);
                }
            }
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
        dispatch({
            type: ALERT_REDUX_ACTIONS.SHOW,
            alert: error,
        });
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
        if (onRemove) onRemove(index);
        handleChange(null, null);
    };

    const visibility = !disabledRemove && preview ? 'visible' : 'hidden';

    const img = preview ? preview : `/${'images/upload.png'}`;
    const objectFit = preview
        ? {}
        : {
              objectFit: 'contain',
          };

    return (
        <>
            <FileManagerPicker show={showFile} onClose={handleCloseFile} title="Choose File" />
            <ListPicker show={showMenu} onClose={handleCloseMenu} data={MENU_LIST_ITEMS} title="Choose Action" />
            <div {...rest} className={[classes.container]}>
                <IconButton style={{ visibility: visibility }} onClick={handleRemove} className={classes.removeButton}>
                    <Icon>close</Icon>
                </IconButton>
                <img
                    onClick={handleImageClick}
                    src={img}
                    className={classes.image}
                    alt={preview && preview.id ? preview.name : 'Uploaded Image'}
                    style={{
                        ...objectFit,
                        maxWidth: size.width,
                        maxHeight: size.height,
                        width: size.width,
                        height: size.height,
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
