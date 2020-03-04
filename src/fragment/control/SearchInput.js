import * as React from 'react';
import { TextField, TextFieldProps, InputAdornment, Icon, IconButton } from '@material-ui/core';

export type SearchIpnutProps = {
    ...TextFieldProps,
    icon?: string,
    required: boolean,
    label: string,
    onSearch(search: string): ?Function,
    onChange(event: React.SyntheticEvent<HTMLInputElement>): ?Function,
};

export default function SearchInput(props: SearchIpnutProps) {
    const { id, name, value, onSearch, onChange, ...rest } = props;
    const [search, setSearch] = React.useState(value);
    const searchTextField = React.createRef();

    const handleTextChange = event => {
        setSearch(event.target.value);

        if (onChange) {
            onChange(event);
        }
    };

    const handleKeyDown = event => {
        if (event.keyCode === 13) {
            if (onSearch) {
                onSearch(search);
            }
        }
    };

    const handleClearText = () => {
        searchTextField.current.value = '';
        setSearch('');
        onSearch('');
    };

    const buildInputIcon = () => {
        const hasFilterText = search && search.length > 0;
        let inputProps = {
            startAdornment: (
                <InputAdornment position="start">
                    <Icon color="primary">search</Icon>
                </InputAdornment>
            ),
        };

        if (hasFilterText) {
            inputProps.endAdornment = (
                <InputAdornment position="end">
                    {search ? (
                        <IconButton edge="end" aria-label="Clear filter text" onClick={handleClearText} size="small">
                            <Icon color="primary" fontSize="small">
                                close
                            </Icon>
                        </IconButton>
                    ) : null}
                </InputAdornment>
            );
        }

        return inputProps;
    };

    return (
        <TextField
            placeholder="Search"
            variant="outlined"
            margin="dense"
            fullWidth
            {...rest}
            inputRef={searchTextField}
            id={id || name}
            name={name || id}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            InputProps={buildInputIcon()}
        />
    );
}
