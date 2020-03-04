import * as React from 'react';
import { FormControlLabel, CheckboxProps, Checkbox } from '@material-ui/core';

export type CheckboxInputProps = {
    ...CheckboxProps,
    label: String,
    value: String,
    checked: Boolean,
    required: Boolean,
};

const CheckboxInput = (props: CheckboxInputProps) => {
    const { label, inputRef, value, onChange, checked, ...checkboxProps } = props;
    const [state, setState] = React.useState(checked);
    const currentInput = inputRef || React.createRef();

    //Set value if props.value changed.
    React.useEffect(() => {
        if (currentInput.current) {
            currentInput.current.checked = checked;
            handleChange({ target: currentInput.current });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checked]);

    const handleChange = event => {
        setState(event.target.checked);
        if (onChange && event) {
            onChange(event);
        }
    };

    return (
        <FormControlLabel
            control={<Checkbox checked={state} inputRef={currentInput} onChange={handleChange} value={value} color="primary" {...checkboxProps} />}
            label={label}
        />
    );
};

export default CheckboxInput;
