import * as React from 'react';
import { TextField, TextFieldProps, InputAdornment, Icon } from '@material-ui/core';
import FormatManager from '../../util/FormatManager';

export type TextInputProps = {
    ...TextFieldProps,
    icon?: string,
    required: boolean,
    label: string,
    onValidate(event: React.SyntheticEvent<HTMLInputElement>): (?Function) => string,
    onChange(event: React.SyntheticEvent<HTMLInputElement>): ?Function,
};

export default function TextInput(props: TextInputProps) {
    const [error, setError] = React.useState('');
    const [invalid, setInvalid] = React.useState(false);

    //Remove default onChange
    //Skip onValidate props to parent componets
    const { id, name, inputRef, value, onChange, onValidate, icon, ...rest } = props;

    const currentInput = inputRef || React.createRef();

    //Set value if props.value changed.
    React.useEffect(() => {
        const newValue = FormatManager.defaultNull(value) || '';

        if (currentInput.current && newValue !== currentInput.current.value) {
            currentInput.current.value = newValue;
            console.log('on change', currentInput.current, currentInput.current.id, newValue, currentInput.current.setCustomValidity);
            handleTextChange({
                target: currentInput.current,
            });
        }
        console.log('not change', currentInput.current.id, newValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleTextChange = event => {
        const data = event.target.value;
        console.log(event.target.id, event.target.value);
        let errorText = '';
        if (props.required && (!data || data.length <= 0)) {
            errorText = props.label + " can't be blank.";
        } else if (onValidate) {
            errorText = onValidate(event);
        }
        setError(errorText);
        event.target.setCustomValidity(errorText);
        setInvalid(errorText.length > 0);
        console.log('onchange', event.target, event.target.id, event.target.value);
        if (onChange) {
            onChange(event);
        }
    };

    const buildInputIcon = icon => {
        if (icon) {
            return {
                startAdornment: (
                    <InputAdornment position="start">
                        <Icon>{icon}</Icon>
                    </InputAdornment>
                ),
                ...props.InputProps,
            };
        }
        return props.InputProps;
    };

    const placeholder = 'Enter ' + FormatManager.camelToReadable(id || name);

    return (
        <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            InputLabelProps={{
                shrink: true,
            }}
            placeholder={placeholder}
            {...rest}
            id={id || name}
            name={name || id}
            inputRef={currentInput}
            error={invalid}
            helperText={error}
            onChange={handleTextChange}
            InputProps={buildInputIcon(icon)}
        />
    );
}
