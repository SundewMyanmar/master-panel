import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import { TextInput, EmailInput, PasswordInput, NumberInput, ImageInput, CheckboxInput, ListInput, ObjectInput, IconInput } from './control';
import { TextInputProps } from './control/TextInput';

export type Field = {
    ...TextInputProps,
    data?: Array | Object,
    onValidate(event: React.SyntheticEvent<HTMLInputElement>, form?: Object): (?Function) => string,
};

export type GridProps = {
    row: number,
    col: number,
};

export type MasterFormProps = {
    fields: Array<Field>,
    grid: GridProps,
    onWillSubmit(form: Object): (?Function) => boolean,
    onSubmit(event: React.SyntheticEvent<HTMLFormElement>, form: Object): ?Function,
    onInputChange: ?Function,
    onKeyDown: ?Function,
};

//const CHILDREN_MAPPING = [TextInput, EmailInput, PasswordInput, NumberInput, ImageInput];

const MasterForm = React.forwardRef((props: MasterFormProps, ref) => {
    const [form, setForm] = useState({});

    const { direction, onWillSubmit, onSubmit, onInputChange, onKeyDown, children, fields, ...rest } = props;

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

        if (onInputChange) {
            onInputChange(event);
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
            case 'icon':
                return <IconInput {...inputProps} />;
            case 'file':
                return <ImageInput {...inputProps} />;
            case 'list':
                return <ListInput {...inputProps} />;
            case 'table':
                return <ObjectInput {...inputProps} />;
            default:
                return <TextInput type={type} {...inputProps} />;
        }
    };

    return (
        <form style={{ width: '100%' }} {...rest} ref={ref} onKeyDown={handleKeyDown} onSubmit={handleFormSubmit}>
            <Grid lg direction={direction || 'column'} container spacing={1} alignItems={direction == 'row' ? 'center' : 'stretch'}>
                {fields.map((field, index) => {
                    const { type, ...inputProps } = field;
                    inputProps.key = field.id + '_' + index;
                    inputProps.name = field.name || field.id;
                    inputProps.onChange = event => handleValueChange(field, event);

                    if (field.onValidate) {
                        inputProps.onValidate = event => field.onValidate(event, form);
                    }

                    return (
                        <Grid key={`grid_${inputProps.key}`} item xs spacing={2}>
                            {renderControl(type, inputProps)}
                        </Grid>
                    );
                })}
            </Grid>
            {children}
        </form>
    );
});

export default MasterForm;
