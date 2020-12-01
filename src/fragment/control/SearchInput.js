import * as React from 'react';
import { TextField, TextFieldProps, InputAdornment, Icon, IconButton, makeStyles } from '@material-ui/core';
import FormatManager from '../../util/FormatManager';

export type SearchIpnutProps = {
    ...TextFieldProps,
    icon?: string,
    required: boolean,
    label: string,
    onSearch?: (search: string) => void,
    onChange?: (event: React.SyntheticEvent<HTMLInputElement>) => void,
};

const styles = makeStyles(theme => ({
    closeButton: {
        color: theme.palette.text.primary,
    },
}));

export default function SearchInput(props: SearchIpnutProps) {
    const { id, name, value, onSearch, onChange, ...rest } = props;
    const [search, setSearch] = React.useState(value);
    const searchTextField = React.createRef();
    const classes = styles();
    //Set value if props.value changed.
    React.useEffect(() => {
        const newValue = FormatManager.defaultNull(value) || '';

        if (searchTextField.current && newValue !== searchTextField.current.value) {
            searchTextField.current.value = newValue;
            handleTextChange({ target: searchTextField.current });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

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
                    <Icon color="textPrimary">search</Icon>
                </InputAdornment>
            ),
        };

        if (hasFilterText) {
            inputProps.endAdornment = (
                <InputAdornment position="end">
                    {search ? (
                        <IconButton edge="end" aria-label="Clear filter text" onClick={handleClearText} size="small">
                            <Icon className={classes.closeButton} fontSize="small">
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
