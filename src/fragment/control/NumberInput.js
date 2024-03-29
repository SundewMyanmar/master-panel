import * as React from 'react';
import TextInput from './TextInput';
import Input from '@material-ui/core/Input';
import type { TextInputProps } from './TextInput';

export interface NumberInputProps extends TextInputProps {
    valid?: 'integer' | 'decimal' | 'uInteger' | 'uDecimal';
}

const VALIDATE_REGEX = {
    integer: /^-?\d+$/,
    decimal: /^-?\d*(\.\d+)?$/,
    uInteger: /^\d+$/,
    uDecimal: /^\d*(\.\d+)?$/,
};

export default function NumberInput(props: NumberInputProps) {
    const { onValidate, ...rest } = props;
    const type = ['integer', 'uInteger'].includes(props.valid) ? 'number' : 'text';
    const handleValidation = (event) => {
        const value = event.target.value;
        if (!value || value == '') return '';

        const regex = VALIDATE_REGEX[props.valid];

        let error = '';
        if (!regex.test(value)) {
            error = 'Invalid number format!';
        } else if (onValidate) {
            error = onValidate(event);
        }

        return error;
    };
    return <TextInput type={type} onValidate={handleValidation} {...rest} />;
}

NumberInput.defaultProps = {
    valid: 'integer',
};
