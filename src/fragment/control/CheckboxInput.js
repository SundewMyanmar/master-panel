/* @flow */
import * as React from 'react';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import type { CheckboxProps } from '@material-ui/core';

export interface CheckboxInputProps extends CheckboxProps {
    label: string;
    value: string;
    checked: boolean;
    required: boolean;
}

const CheckboxInput = (props: CheckboxInputProps) => {
    const { label, ...checkboxProps } = props;

    return <FormControlLabel control={<Checkbox color="default" {...checkboxProps} />} label={label} />;
};

export default CheckboxInput;
