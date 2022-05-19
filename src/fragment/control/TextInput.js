/**
 * @flow
 */
import * as React from 'react';
import { TextField, InputBase, InputAdornment, Icon } from '@material-ui/core';
import FormatManager from '../../util/FormatManager';
import type { TextFieldProps } from '@material-ui/core';

export interface TextInputProps extends TextFieldProps {
    icon?: String;
    required: Boolean;
    disabled: Boolean;
    autoFocus: Boolean;
    label: String;
    hidePlaceHolder: Boolean;
    variant: 'filled' | 'outlined' | 'standard';
    multiline: Boolean;
    onValidate?: (event: React.SyntheticEvent<HTMLInputElement>) => String;
    onChange?: (event: React.SyntheticEvent<HTMLInputElement>) => void;
}

const TextInput = (props: TextInputProps) => {
    const [error, setError] = React.useState('');
    const [invalid, setInvalid] = React.useState(false);

    //Remove default onChange
    //Skip onValidate props to parent componets
    const { id, name, hidePlaceHolder, placeholder, variant, inputRef, value, inputAdornment, onChange, onValidate, icon, ...rest } = props;

    const currentInput = inputRef || React.createRef();

    //Set value if props.value changed.
    React.useEffect(() => {
        const newValue = FormatManager.defaultNull(value) || value === 0 ? value : '';

        if (currentInput.current && newValue !== currentInput.current.value) {
            currentInput.current.value = newValue;
            if (onChange) {
                onChange({
                    target: currentInput.current,
                    value: newValue,
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleTextChange = (event) => {
        const data = event.target.value;
        let errorText = '';
        if (props.required && (!data || data.length <= 0)) {
            errorText = (props.label || props.name || props.id) + " can't be blank.";
        } else if (onValidate) {
            errorText = onValidate(event);
        }
        setError(errorText);
        event.target.setCustomValidity(errorText);
        setInvalid(errorText.length > 0);
        if (onChange) {
            onChange(event);
        }
    };
    const endAdornment = inputAdornment ? { endAdornment: inputAdornment } : {};
    const buildInputIcon = (icon) => {
        if (icon) {
            return {
                startAdornment: (
                    <InputAdornment position="start">
                        <Icon>{icon}</Icon>
                    </InputAdornment>
                ),
                ...endAdornment,
                ...props.InputProps,
            };
        } else {
            return {
                ...endAdornment,
                ...props.InputProps,
            }
        }
    };

    let placeholderText = hidePlaceHolder ? '' : placeholder;
    if (!placeholderText) placeholderText = hidePlaceHolder ? '' : 'Enter ' + props.label || FormatManager.camelToReadable(name || id);

    let variantProps = { variant: variant };
    if (variant !== 'standard') {
        variantProps = {
            ...variantProps,
            InputLabelProps: {
                shrink: true,
            },
            helperText: error,
        };
    }

    return (
        <>
            {variant === 'standard' ? (
                <InputBase
                    {...variantProps}
                    margin="dense"
                    fullWidth
                    placeholder={placeholderText}
                    {...rest}
                    id={id || name}
                    name={name || id}
                    inputRef={currentInput}
                    error={invalid}
                    onChange={handleTextChange}
                    InputProps={buildInputIcon(icon)}
                />
            ) : (
                <TextField
                    {...variantProps}
                    margin="normal"
                    fullWidth
                    placeholder={placeholderText}
                    {...rest}
                    id={id || name}
                    name={name || id}
                    inputRef={currentInput}
                    error={invalid}
                    onChange={handleTextChange}
                    InputProps={buildInputIcon(icon)}
                />
            )}
        </>
    );
};

TextInput.defaultProps = {
    variant: 'outlined',
    hidePlaceHolder: false,
};

export default TextInput;
