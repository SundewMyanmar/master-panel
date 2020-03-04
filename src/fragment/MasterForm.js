import React, { useState } from 'react';
import { TextInput, EmailInput, PasswordInput, NumberInput, ImageInput, CheckboxInput, SelectList, ObjectInput, IconInput } from './control';
import { TextInputProps } from './control/TextInput';

export type Field = {
    ...TextInputProps,
    data?: Array | Object,
    onValidate(event: React.SyntheticEvent<HTMLInputElement>, form?: Object): (?Function) => string,
};

export type GridProps = {
    row: Number,
    col: Number,
};

export type MasterFormProps = {
    fields: Array<Field>,
    grid: GridProps,
    onWillSubmit(form: Object): (?Function) => boolean,
    onSubmit(event: React.SyntheticEvent<HTMLFormElement>, form: Object): ?Function,
};

//const CHILDREN_MAPPING = [TextInput, EmailInput, PasswordInput, NumberInput, ImageInput];

const MasterForm = React.forwardRef((props: MasterFormProps, ref) => {
    const [form, setForm] = useState({});

    const { onWillSubmit, onSubmit, children, fields, ...rest } = props;

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
    };

    return (
        <form {...rest} ref={ref} onSubmit={handleFormSubmit}>
            {fields.map((field, index) => {
                const { type, ...inputProps } = field;
                inputProps.key = field.id + '_' + index;
                inputProps.name = field.name || field.id;
                inputProps.onChange = event => handleValueChange(field, event);

                if (field.onValidate) {
                    inputProps.onValidate = event => field.onValidate(event, form);
                }

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
                        return <SelectList {...inputProps} />;
                    case 'table':
                        return <ObjectInput {...inputProps} />;
                    default:
                        return <TextInput {...inputProps} />;
                }
            })}
            {children}
        </form>
    );
});

export default MasterForm;
