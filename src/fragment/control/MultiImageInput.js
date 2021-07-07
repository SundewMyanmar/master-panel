import React, { useState, createRef, useEffect } from 'react';
import { InputProps, IconButton, makeStyles, Icon } from '@material-ui/core';
import ImageInput from './ImageInput';

const styles = makeStyles(theme => ({
    moveButton: {
        color: theme.palette.error.main,
    },
}));

const MultiImageInput = props => {
    const classes = styles();
    const { id, name, values, onChange, onRemove, ...rest } = props;
    const [images, setImages] = useState([{}]);
    //Set value if props.value changed.
    React.useEffect(() => {
        if (images.length == 1 && Object.entries(images[0]).length === 0) setImages(values ? [...values, {}] : [{}]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values]);

    const handleMove = idx => {
        let img1 = Object.assign({}, images[idx]);
        let img2 = Object.assign({}, images[idx + 1]);
        let imgs = Object.assign([], images);
        imgs[idx] = img2;
        imgs[idx + 1] = img1;
        console.log('handle move', imgs);
        setImages([...imgs]);
        let dataImgs = [];
        for (let i = 0; i < imgs.length; i++) {
            if (imgs[i].target) dataImgs.push(imgs[i].target.value);
        }
        if (onChange) {
            onChange({
                target: {
                    type: 'multi-image',
                    name: id || name,
                    value: dataImgs,
                },
            });
        }
    };

    const handleChange = (obj, idx) => {
        images[idx] = obj;
        console.log('handle change imagegg', obj.target.value, idx);
        if (onChange) {
            onChange(
                {
                    target: {
                        type: 'multi-image',
                        name: id || name,
                        value: obj.target.value,
                    },
                },
                idx,
            );
        }
        if (!obj.target || !obj.target.value) {
            setImages([...images]);

            return;
        }
        if (idx == images.length - 1) {
            setImages([...images, {}]);
        } else {
            setImages([...images]);
        }
    };

    const handleRemove = idx => {
        if (onChange) {
            onChange(
                {
                    target: {
                        type: 'multi-image',
                        name: id || name,
                        value: {},
                    },
                },
                idx,
            );
        }

        // let result = JSON.parse(JSON.stringify(images));
        // result.splice(idx, 1);
        // for (var i = 0; i < result.length; i++) {
        //     console.log('remove img', idx, result[i].target);
        // }
        // setImages([...result]);
    };

    return (
        <div>
            {images.map((img, idx) => {
                return (
                    <>
                        <ImageInput
                            size={{ width: 120, height: 120 }}
                            key={'img' + idx}
                            index={idx}
                            value={img}
                            onChange={handleChange}
                            onRemove={handleRemove}
                            {...rest}
                        />
                        {idx < images.length - 2 ? (
                            <>
                                <IconButton
                                    onClick={() => {
                                        handleMove(idx);
                                    }}
                                    className={classes.moveButton}
                                >
                                    <Icon>repeat</Icon>
                                </IconButton>
                            </>
                        ) : (
                            <></>
                        )}
                    </>
                );
            })}
        </div>
    );
};

export default MultiImageInput;
