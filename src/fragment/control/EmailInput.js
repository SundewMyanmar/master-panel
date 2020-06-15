/* @flow */
import * as React from 'react';
import TextInput, { TextInputProps } from './TextInput';
import FormatManager from '../../util/FormatManager';

type Props = {
    ...TextInputProps,
};

export default function EmailInput(props: Props) {
    const { onValidate, ...rest } = props;

    const validateEmail = event => {
        const value = event.target.value;
        let error = '';
        if (!FormatManager.ValidateEmail(value)) {
            error = 'Invalid e-mail address!';
        } else if (onValidate) {
            error = onValidate(event);
        }

        return error;
    };

    return <TextInput icon="mail" type="email" onValidate={validateEmail} {...rest} />;
}
