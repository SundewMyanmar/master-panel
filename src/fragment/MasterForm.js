import React, { useState, ReactDOM, useEffect, useRef } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import {
    TextInput,
    EmailInput,
    PasswordInput,
    NumberInput,
    ImageInput,
    MultiImageInput,
    CheckboxInput,
    ListInput,
    ObjectInput,
    IconInput,
    ChipInput,
    ColorInput,
    TabControl,
    TinyEditorInput,
    DateTimeInput,
} from './control';
import type { TextInputProps } from './control/TextInput';
import type { FormHTMLAttributes } from 'react';

export interface Field extends TextInputProps {
    data?: Array | Object;
    onValidate?: (event: React.SyntheticEvent<HTMLInputElement>, form?: object) => string;
}

export interface MasterFormProps extends FormHTMLAttributes {
    fields: Array<Field>;
    type: 'form' | 'tab';
    onWillSubmit?: (form: object) => boolean;
    onSubmit?: (event: React.SyntheticEvent<HTMLFormElement>, form: object) => void;
    onChange: (event: React.SyntheticEvent<HTMLFormElement>, index: number) => void;
    onKeyDown: (event: object) => void;
}

const styles = makeStyles((theme) => ({
    container: {
        backgroundColor: theme.palette.background.paper,
    },
}));

//const CHILDREN_MAPPING = [TextInput, EmailInput, PasswordInput, NumberInput, ImageInput];
export const PROCESSABLE_FIELDS = [
    'TextInput',
    'EmailInput',
    'PasswordInput',
    'NumberInput',
    'ImageInput',
    'MultiImageInput',
    'CheckboxInput',
    'ListInput',
    'ObjectInput',
    'IconInput',
    'ChipInput',
    'ColorInput',
    'TabControl',
    'TinyEditorInput',
    'DateTimeInput',
];

const MasterForm = React.forwardRef((props: MasterFormProps, ref) => {
    const [form, setForm] = useState({});
    const classes = styles();
    const { type, variant, spacing, direction, onWillSubmit, onSubmit, onChange, onKeyDown, children, fields, ...formProps } = props;

    //Research Code, no use
    const findInputValues = (node) => {
        if (!node) {
            return null;
        }

        const grandChildren = node.props?.children;
        if (grandChildren && typeof grandChildren === 'object' && Array.isArray(grandChildren)) {
            for (let i = 0; i < grandChildren.length; i++) {
                findInputValues(grandChildren[i]);
            }
        } else {
            findInputValues(grandChildren);
        }

        if (typeof node === 'object' && node.type?.name && PROCESSABLE_FIELDS.includes(node.type?.name)) {
            const input = document.getElementById(node.props.id);
            if (input) {
                console.log('Input Found => ', input);
                console.log(`Input Required => ${input.required}`);
                console.log(`Get Value => ${input.value}`);
                form[input.id] = input.value;
                setForm(form);
            }
        }
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();

        let allow = true;

        if (onWillSubmit) {
            allow = onWillSubmit(form);
        }

        if (allow && onSubmit) {
            onSubmit(event, form);
        }
    };

    const handleValueChange = (field, event, index) => {
        if (field.type === 'checkbox') {
            form[field.id] = event.target.checked;
        } else if (field.type === 'multi-image') {
            if (!form[field.id]) form[field.id] = [];
            if (!form[field.id][index]) {
                form[field.id].push(event.target.value);
            } else {
                form[field.id][index] = event.target.value;
            }
        } else {
            form[event.target.name] = event.target.value;
        }

        setForm(form);

        if (onChange) {
            onChange(event, index);
        }
    };

    const handleKeyDown = (e) => {
        if (onKeyDown) {
            onKeyDown(e);
        }
    };

    const renderControl = (field, inputProps, index) => {
        inputProps = { ...inputProps };

        switch (field.type) {
            case 'email':
                return <EmailInput {...inputProps} />;
            case 'password':
                return <PasswordInput {...inputProps} />;
            case 'number':
                return <NumberInput {...inputProps} />;
            case 'datetime':
                return <DateTimeInput type="datetime" {...inputProps} />;
            case 'date':
                return <DateTimeInput type="date" {...inputProps} />;
            case 'time':
                return <DateTimeInput type="time" {...inputProps} />;
            case 'checkbox':
                if (inputProps.checked == null) {
                    inputProps.checked = false;
                }
                return <CheckboxInput {...inputProps} />;
            case 'image':
                return <ImageInput {...inputProps} />;
            case 'multi-image': {
                return <MultiImageInput {...inputProps} />;
            }
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
            case 'editor':
                return <TinyEditorInput {...inputProps} />;
            case 'custom':
                return inputProps.control;
            default:
                return <TextInput type={type} {...inputProps} />;
        }
    };

    const renderTab = (inputFields) => {
        if (!inputFields || inputFields.length <= 0) {
            return null;
        }

        inputFields = inputFields.map((field) => {
            if (field.fields) {
                field.content = renderForm(field.fields);
            }

            return field;
        });

        return <TabControl tabs={inputFields}></TabControl>;
    };

    const renderForm = (inputFields) => {
        if (!inputFields || inputFields.length <= 0) {
            return null;
        }
        return (
            <Grid
                style={{ backgroundColor: 'inherit' }}
                direction={direction || 'column'}
                spacing={spacing || 0}
                container
                alignItems={direction === 'row' ? 'center' : 'stretch'}
            >
                {inputFields.map((field, index) => {
                    const { type, ...inputProps } = field;
                    inputProps.key = field.id + '_' + index;
                    inputProps.name = field.name || field.id;
                    inputProps.onChange = (event, index) => handleValueChange(field, event, index);

                    if (field.onValidate && field.type !== 'checkbox') {
                        inputProps.onValidate = (event) => field.onValidate(event, form);
                    }

                    return (
                        <Grid className={classes.container} key={`grid_${inputProps.key}`} item>
                            {renderControl(field, inputProps, index)}
                        </Grid>
                    );
                })}
            </Grid>
        );
    };

    return (
        <form style={{ width: '100%' }} {...formProps} ref={ref} onKeyDown={handleKeyDown} onSubmit={handleFormSubmit}>
            {type == 'tab' ? renderTab(fields) : renderForm(fields)}
            {children}
        </form>
    );
});

MasterForm.defaultProps = {
    type: 'form',
};

export default MasterForm;
