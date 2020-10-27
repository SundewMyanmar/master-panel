import React, { useState, createRef, useEffect } from 'react';
import { InputProps, IconButton, makeStyles, Icon } from '@material-ui/core';
import ImageInput from './ImageInput';

const styles = makeStyles((theme) => ({
    ////
}));

const MultiImageInput = (props) => {
    const classes = styles();
    const { id, name, values, onChange, onRemove, ...rest } = props;
    const [images, setImages] = useState([{}]);

    const handleChange = (obj, idx) => {
        images[idx] = obj;

        if (onChange) {
            onChange(obj, idx);
        }

        console.log('handle img', idx, images);
        if (!obj.target || !obj.target.value) {
            setImages([...images]);
            return;
        }
        if (idx == images.length - 1) {
            console.log('here img', idx, images.length);
            setImages([...images, {}]);
        } else setImages([...images]);
    };

    const handleRemove = (idx) => {
        let result = JSON.parse(JSON.stringify(images));
        result.splice(idx, 1);
        for (var i = 0; i < result.length; i++) {
            console.log('remove img', idx, result[i].target);
        }
        setImages([...result]);
    };

    return (
        <div>
            {images.map((img, idx) => {
                console.log('img', idx, img);
                return (
                    <>
                        {idx}
                        <ImageInput
                            size={{ width: 120, height: 120 }}
                            key={'img' + idx}
                            index={idx}
                            value={img}
                            onChange={handleChange}
                            onRemove={handleRemove}
                            {...rest}
                        />
                    </>
                );
            })}
        </div>
    );
};

export default MultiImageInput;
