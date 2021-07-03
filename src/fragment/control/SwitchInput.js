import * as React from 'react';
import { Switch, FormControlLabel } from '@material-ui/core';

export type SwitchInputProps = {
    label: string,
    value: string,
    checked: boolean,
    required: boolean,
    labelPlacement: 'top' | 'start' | 'end' | 'bottom',
};

const SwitchInput = (props: SwitchInputProps) => {
    const { label, inputRef, value, checked, labelPlacement, onChange, ...switchProps } = props;
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
            value={label}
            control={<Switch color="primary" checked={state} inputRef={currentInput} onChange={handleChange} value={value} {...switchProps} />}
            label={label}
            labelPlacement={labelPlacement}
        />
    );
};

SwitchInput.defaultProps = {
    labelPlacement: 'end',
    checked: false,
    required: false,
    value: false,
};

export default SwitchInput;
