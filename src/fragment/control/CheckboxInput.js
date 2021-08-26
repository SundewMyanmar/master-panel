/* @flow */
import * as React from 'react';
import { FormControlLabel, CheckboxProps, Checkbox } from '@material-ui/core';

export type CheckboxInputProps = {
    ...CheckboxProps,
    label: string,
    value: string,
    checked: boolean,
    required: boolean,
};

const CheckboxInput = (props: CheckboxInputProps) => {
    const { label, ...checkboxProps } = props;

    return <FormControlLabel control={<Checkbox color="default" {...checkboxProps} />} label={label} />;
};

export default CheckboxInput;
