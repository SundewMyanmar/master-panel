/* @flow */
import * as React from 'react';
import TextInput, { TextInputProps } from './TextInput';
import FormatManager from '../../util/FormatManager';

type Props = {
    ...TextInputProps,
};

export default function EmailInput(props: Props) {
    const { variant, onValidate, ...rest } = props;

    const validateEmail = (event) => {
        const value = event.target.value;
        let error = '';
        if (!FormatManager.ValidateEmail(value)) {
            error = 'Invalid e-mail address!';
        } else if (onValidate) {
            error = onValidate(event);
        }

        return error;
    };
    let variantProps = { variant: variant };
    if (variant !== 'standard') {
        variantProps = {
            ...variantProps,
            icon: 'mail',
        };
    }

    return <TextInput {...variantProps} type="email" onValidate={validateEmail} {...rest} />;
}
