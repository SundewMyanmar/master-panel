import * as React from 'react';
import {
    InputProps,
    TextField,
    Icon,
    Paper,
    makeStyles,
    FormControl,
    InputLabel,
    Grid,
    Chip,
    InputAdornment,
    FormHelperText,
} from '@material-ui/core';
import FormatManager from '../../util/FormatManager';

export type ChipInputProps = {
    ...InputProps,
    value?: Object,
    icon?: string,
    required: boolean,
    label: string,
    disableRemove?: boolean,
    disableInsert?: boolean,
    onValidate?: (event: React.SyntheticEvent<HTMLInputElement>) => string,
    onChange?: (event: React.SyntheticEvent<HTMLInputElement>) => void,
};

const styles = makeStyles((theme) => ({
    root: {
        backgroundColor: 'inherit',
    },
    chipTextInput: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
    label: (props) => ({
        backgroundColor: 'inherit',
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(2),
        color: props.invalid ? theme.palette.error.main : theme.palette.primary.main,
    }),
    chipTextField: { position: 'relative', flex: 1, paddingRight: 14, paddingLeft: 1 },
    content: (props) => ({
        backgroundColor: 'inherit',
        minHeight: theme.spacing(6),
        padding: theme.spacing(0.5, 0.5, 0.5, 0.5),
        borderColor: props.invalid ? theme.palette.error.main : theme.palette.common.gray,
        '&:hover': {
            borderColor: props.invalid ? theme.palette.error.main : theme.palette.primary.main,
        },
    }),
    chip: {
        margin: theme.spacing(0.5, 0.5, 0, 0),
    },
    icon: {
        marginRight: theme.spacing(1),
        marginTop: theme.spacing(1),
    },
    placeholder: {
        color: theme.palette.text.hint,
    },
    actionButton: {},
}));

const ChipInput = (props: ChipInputProps) => {
    const { variant, label, id, name, inputRef, value, icon, disableRemove, disableInsert, onValidate, onChange, ...rest } = props;
    const [error, setError] = React.useState('');
    const [invalid, setInvalid] = React.useState(false);
    const [newChip, setNewChip] = React.useState('');
    const [items, setItems] = React.useState([]);
    const classes = styles({ invalid });
    const currentInput = inputRef || React.createRef();

    //Set value if props.value changed.
    React.useEffect(() => {
        const inputData = FormatManager.defaultNull(value);
        if (inputData !== items) {
            var splitData = inputData.split(',');
            if (splitData) {
                setItems(splitData);
            }
            if (onChange) {
                onChange({
                    target: {
                        type: 'chip',
                        name: id || name,
                        value: inputData,
                    },
                });
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleKeyDown = (evt) => {
        if (['Enter', 'Tab', ','].includes(evt.key)) {
            evt.preventDefault();
            let chip = newChip;
            console.log('chip', chip);
            if (chip) {
                setItems([...items, chip]);
                setNewChip('');
                if (onChange) {
                    onChange({
                        target: {
                            type: 'chip',
                            name: id || name,
                            value: [...items, chip].join(),
                        },
                    });
                }
            }
        }
    };

    const handleTextChange = (event) => {
        const data = event.target.value;
        let errorText = '';
        if (props.required && (!data || data.length <= 0)) {
            errorText = props.label + " can't be blank.";
        } else if (onValidate) {
            errorText = onValidate(event);
        }
        setError(errorText);
        event.target.setCustomValidity(errorText);
        setInvalid(errorText.length > 0);
        setNewChip(data);
    };

    const handlePaste = (evt) => {
        evt.preventDefault();
        var pasteValue = evt.clipboardData.getData('text');
        if (currentInput.current && pasteValue !== currentInput.current.value) {
            currentInput.current.value = pasteValue;
            handleTextChange({ type: 'chip', name: id || name, target: currentInput.current });
        }
    };

    const handleRemove = (item, index) => {
        items.splice(index, 1);
        setItems([...items]);
        if (onChange) {
            onChange({
                target: {
                    type: 'chip',
                    name: id || name,
                    value: items.join(),
                },
            });
        }
    };

    const buildInputIcon = (icon) => {
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

    const displayBox = () => {
        return (
            <>
                {items.map((item, index) => {
                    return (
                        <Chip
                            onDelete={disableRemove ? null : () => handleRemove(item, index)}
                            className={classes.chip}
                            key={'chip' + index}
                            label={item}
                        />
                    );
                })}
            </>
        );
    };

    const inputPlaceholder = 'Enter ' + FormatManager.camelToReadable(id || name);

    let variantProps = { variant: variant, elevation: 0 };
    if (variant !== 'standard') {
        variantProps = { ...variantProps, elevation: 1 };
    }

    return (
        <>
            <FormControl id={id || name} name={name || id} variant="outlined" margin="normal" fullWidth className={classes.root}>
                <InputLabel className={classes.label} shrink htmlFor="bootstrap-input">
                    {label} {props.required ? '*' : ''}
                </InputLabel>
                <Paper {...variantProps} classes={{ root: classes.content }}>
                    <Grid container>
                        <Grid container item xs={12} sm={12} className={classes.chipContainer} alignItems="center">
                            <div className={classes.chipTextField}>{displayBox()}</div>
                            {disableInsert || (
                                <TextField
                                    className={classes.chipTextInput}
                                    margin="normal"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    placeholder={inputPlaceholder}
                                    {...rest}
                                    inputRef={currentInput}
                                    onKeyDown={handleKeyDown}
                                    onChange={handleTextChange}
                                    onPaste={handlePaste}
                                    InputProps={buildInputIcon(icon)}
                                    value={newChip}
                                />
                            )}
                        </Grid>
                    </Grid>
                </Paper>
                {invalid ? <FormHelperText error={invalid}>{error}</FormHelperText> : null}
            </FormControl>
        </>
    );
};

export default ChipInput;
