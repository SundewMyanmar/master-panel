import * as React from 'react';
import { InputAdornment, Icon, IconButton } from '@material-ui/core';
import TextInput from './TextInput';
import type { TextInputProps } from './TextInput';

export interface PasswordInputProps extends TextInputProps {
    strength?: 'none' | 'moderate' | 'complex';
}

const STRENGTH_REGEX = {
    complex: /(?=(.*[0-9]))(?=.*[!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/,
    moderate: /(?=(.*[0-9]))((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.{8,}$/,
};

export default function PasswordInput(props: PasswordInputProps) {
    const [showPassword, setShowPassword] = React.useState(false);
    const { onValidate, variant, ...rest } = props;

    const handleValidation = (event) => {
        const value = event.target.value;
        const regex = STRENGTH_REGEX[props.strength];
        let error = '';
        if (props.strength !== 'none' && !regex.test(value)) {
            error =
                props.strength === 'moderate'
                    ? 'Should have 1 lowercase letter, 1 uppercase letter, 1 number, and be at least 8 characters long.'
                    : 'Should have 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character and be at least 8 characters long';
        } else if (onValidate) {
            error = onValidate(event);
        }

        return error;
    };

    let variantProps = { variant: variant };
    if (variant !== 'standard') {
        variantProps = {
            ...variantProps,
            icon: 'lock',
        };
    }

    return (
        <TextInput
            {...rest}
            type={showPassword ? 'text' : 'password'}
            {...variantProps}
            onValidate={handleValidation}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} onMouseDown={() => setShowPassword(!showPassword)}>
                            <Icon>{showPassword ? 'visibility' : 'visibility_off'}</Icon>
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
}

PasswordInput.defaultProps = {
    strength: 'none',
};
