import React, { useState, createRef, useEffect } from 'react';
import { InputProps, IconButton, makeStyles, Icon } from '@material-ui/core';
import ImageInput from './ImageInput';

const styles = makeStyles(theme => ({
    ////
}));

const MultiImageInput = props => {
    const classes = styles();
    const { id, name, values, onChange, onRemove, ...rest } = props;
    const [images, setImages] = useState([{}]);
    //Set value if props.value changed.
    React.useEffect(() => {
        console.log('multi-image-here-set', images, values);
        if (images.length == 1 && Object.entries(images[0]).length === 0) setImages(values ? [...values, {}] : [{}]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values]);

    const handleChange = (obj, idx) => {
        images[idx] = obj;
        console.log('multi-image-here', obj, idx);
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
            console.log('here 1');
            return;
        }
        if (idx == images.length - 1) {
            setImages([...images, {}]);
            console.log('here 2');
        } else {
            setImages([...images]);
            console.log('here 3');
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
                console.log('img', idx, img);
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
                    </>
                );
            })}
        </div>
    );
};

export default MultiImageInput;
