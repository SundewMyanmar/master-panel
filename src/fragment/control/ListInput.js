import * as React from 'react';
import { TextField, InputBase, Icon, InputAdornment } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import FormatManager from '../../util/FormatManager';
import type { TextFieldProps } from '@material-ui/core';

export interface SelectListProps extends TextFieldProps {
    data: Array<Object>;
    icon?: string;
    required: boolean;
    label: string;
    hidePlaceHolder: boolean;
    onLoadItem?: (item: object) => string;
    onValidate?: (event: React.SyntheticEvent<HTMLInputElement>, value: object) => string;
    onChange: (event: React.SyntheticEvent<HTMLInputElement>, value: object) => void;
    disabled: boolean;
}

const ListInput = (props: SelectListProps) => {
    const { variant, disabled, hidePlaceHolder, id, name, icon, data, inputRef, value, onLoadItem, onChange, onValidate, ...rest } = props;
    const [error, setError] = React.useState('');
    const [invalid, setInvalid] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState(value);

    const currentInput = inputRef || React.createRef();

    //Set value if props.value changed.
    React.useEffect(() => {
        const newValue = FormatManager.defaultNull(value) || '';
        if (currentInput.current && newValue !== currentInput.current.value) {
            currentInput.current.value = newValue;
            setSelectedItem(newValue);
            if (onChange) {
                onChange({
                    target: {
                        id: id || name,
                        name: id || name,
                        value: newValue,
                    },
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleChange = (event, item) => {
        let errorText = '';
        if (props.required && !item) {
            errorText = props.label + " can't be blank.";
        } else if (onValidate) {
            errorText = onValidate(event, item);
        }
        setError(errorText);
        currentInput.current.setCustomValidity(errorText);
        setInvalid(errorText.length > 0);
        setSelectedItem(item);
        if (onChange) {
            onChange({
                target: {
                    id: id || name,
                    name: id || name,
                    value: item,
                },
            });
        }
    };

    const buildInputIcon = (inputProps) => {
        if (icon) {
            inputProps.startAdornment = (
                <InputAdornment position="start">
                    <Icon>{icon}</Icon>
                </InputAdornment>
            );
        }
        return inputProps;
    };

    const buildInputField = (params) => {
        const { InputProps, InputLabelProps, ...otherParams } = params;
        let placeholder = 'Choose ' + props.label || FormatManager.camelToReadable(id || name);
        placeholder = hidePlaceHolder || placeholder;

        return (
            <TextField
                variant={variant}
                margin="normal"
                fullWidth
                placeholder={placeholder}
                error={invalid}
                helperText={error}
                {...otherParams}
                {...rest}
                InputProps={buildInputIcon(InputProps)}
                InputLabelProps={{
                    ...InputLabelProps,
                    shrink: true,
                }}
                inputRef={currentInput}
            />
        );
    };

    return (
        <Autocomplete
            fullWidth
            id={id || name}
            name={name || id}
            options={data}
            disabled={disabled}
            getOptionLabel={onLoadItem}
            onChange={handleChange}
            popupIcon={<Icon>arrow_drop_down</Icon>}
            renderInput={buildInputField}
            value={selectedItem || null}
        />
    );
};

ListInput.defaultProps = {
    onLoadItem: (item) => item.toString(),
    hidePlaceHolder: false,
    variant: 'outlined',
};

export default ListInput;
