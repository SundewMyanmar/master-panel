import * as React from 'react';
import { TextFieldProps, TextField, Icon, InputAdornment } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import FormatManager from '../../util/FormatManager';

export type SelectListProps = {
    ...TextFieldProps,
    data: Array<Object>,
    icon?: string,
    required: boolean,
    label: string,
    onLoadItem(item: Object): (?Function) => string,
    onValidate(event: React.SyntheticEvent<HTMLInputElement>, value: Object): (?Function) => string,
    onChange(event: React.SyntheticEvent<HTMLInputElement>, value: Object): ?Function,
};

const ListInput = (props: SelectListProps) => {
    const { id, name, icon, data, inputRef, value, onLoadItem, onChange, onValidate, ...rest } = props;
    const [error, setError] = React.useState('');
    const [invalid, setInvalid] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState(value);

    const currentInput = inputRef || React.createRef();

    //Set value if props.value changed.
    React.useEffect(() => {
        const newValue = FormatManager.defaultNull(value) || '';
        if (currentInput.current && newValue !== currentInput.current.value) {
            currentInput.current.value = newValue;
            handleChange({ target: currentInput.current }, value);
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

    const buildInputIcon = inputProps => {
        if (icon) {
            inputProps.startAdornment = (
                <InputAdornment position="start">
                    <Icon>{icon}</Icon>
                </InputAdornment>
            );
        }
        return inputProps;
    };

    const buildInputField = params => {
        const { InputProps, InputLabelProps, ...otherParams } = params;
        const placeholder = 'Choose ' + FormatManager.camelToReadable(id || name);
        return (
            <TextField
                variant="outlined"
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
            id={id || name}
            name={name || id}
            options={data}
            getOptionLabel={onLoadItem}
            onChange={handleChange}
            popupIcon={<Icon color="primary">arrow_drop_down</Icon>}
            renderInput={buildInputField}
            disableClearable={true}
            value={selectedItem}
        />
    );
};

ListInput.defaultProps = {
    onLoadItem: item => item.toString(),
};

export default ListInput;