// @flow
import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import {
    TextInput,
    EmailInput,
    PasswordInput,
    NumberInput,
    ImageInput,
    CheckboxInput,
    ListInput,
    ObjectInput,
    IconInput,
    ChipInput,
    ColorInput,
    TabControl,
} from './control';
import { MultiImagePicker } from './control/ImageInput';
import { TextInputProps } from './control/TextInput';

export type Field = {
    ...TextInputProps,
    data?: Array | Object,
    onValidate?: (event: React.SyntheticEvent<HTMLInputElement>, form?: Object) => string,
};

/*
<MasterForm type="tab" {...props}/>
//Sample Fields
[
    {
        label:"Tab 1",
        icon:"person"
        fields:[
            //old master form fields
        ]
    },
    {
        label:"Tab 2",
        icon:"person_outline"
        fields:[
            //old master form fields
        ]
    }
]
*/

export type GridProps = {
    row: number,
    col: number,
};

export type MasterFormProps = {
    fields: Array<Field>,
    grid: GridProps,
    type: 'form' | 'tab',
    onWillSubmit?: (form: Object) => boolean,
    onSubmit?: (event: React.SyntheticEvent<HTMLFormElement>, form: Object) => void,
    onChange: () => void,
    onKeyDown: () => void,
};

//const CHILDREN_MAPPING = [TextInput, EmailInput, PasswordInput, NumberInput, ImageInput];

const MasterForm = React.forwardRef((props: MasterFormProps, ref) => {
    const [form, setForm] = useState({});

    const { type, variant, direction, onWillSubmit, onSubmit, onChange, onKeyDown, children, fields, ...rest } = props;

    const handleFormSubmit = event => {
        event.preventDefault();
        let allow = true;

        if (onWillSubmit) {
            allow = onWillSubmit(form);
        }

        if (allow && onSubmit) {
            onSubmit(event, form);
        }
    };

    const handleValueChange = (field, event) => {
        if (field.type === 'checkbox') {
            form[event.target.name] = event.target.checked;
        } else {
            form[event.target.name] = event.target.value;
        }

        setForm(form);

        if (onChange) {
            onChange(event);
        }
    };

    const handleKeyDown = e => {
        if (onKeyDown) {
            onKeyDown(e);
        }
    };

    const renderControl = (type, inputProps) => {
        switch (type) {
            case 'email':
                return <EmailInput {...inputProps} />;
            case 'password':
                return <PasswordInput {...inputProps} />;
            case 'number':
                return <NumberInput {...inputProps} />;
            case 'datetime':
                return <TextInput type="datetime-local" {...inputProps} />;
            case 'date':
                return <TextInput type="date" {...inputProps} />;
            case 'time':
                return <TextInput type="time" {...inputProps} />;
            case 'checkbox':
                return <CheckboxInput {...inputProps} />;
            case 'image':
                return <ImageInput {...inputProps} />;
            // case 'multi-image': {
            //     return <MultiImagePicker {...inputProps} />;
            // }
            case 'icon':
                return <IconInput {...inputProps} />;
            case 'file':
                return <ImageInput {...inputProps} />;
            case 'list':
                return <ListInput {...inputProps} />;
            case 'table':
                return <ObjectInput {...inputProps} />;
            case 'chip':
                return <ChipInput {...inputProps} />;
            case 'color':
                return <ColorInput {...inputProps} />;
            default:
                return <TextInput type={type} {...inputProps} />;
        }
    };

    const renderTab = datas => {
        datas = datas.map(data => {
            data.content = renderGrid(data.fields);
            return data;
        });
        return <TabControl {...rest} centered variant={variant || 'standard'} tabs={datas}></TabControl>;
    };

    const renderGrid = datas => {
        return (
            <Grid direction={direction || 'column'} container alignItems={direction === 'row' ? 'center' : 'stretch'}>
                {datas.map((field, index) => {
                    const { type, ...inputProps } = field;
                    inputProps.key = field.id + '_' + index;
                    inputProps.name = field.name || field.id;
                    inputProps.onChange = event => handleValueChange(field, event);

                    if (field.onValidate) {
                        inputProps.onValidate = event => field.onValidate(event, form);
                    }

                    return (
                        <Grid key={`grid_${inputProps.key}`} item>
                            {renderControl(type, inputProps)}
                        </Grid>
                    );
                })}
            </Grid>
        );
    };

    return (
        <form style={{ width: '100%' }} {...rest} ref={ref} onKeyDown={handleKeyDown} onSubmit={handleFormSubmit}>
            {type == 'tab' ? renderTab(fields) : renderGrid(fields)}
            {children}
        </form>
    );
});

MasterForm.defaultProps = {
    type: 'form',
};

export default MasterForm;
