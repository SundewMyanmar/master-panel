/* @flow */
import * as React from 'react';
import { InputProps, Icon, Paper, makeStyles, FormControl, InputLabel, Grid, IconButton, Typography, Chip, FormHelperText } from '@material-ui/core';
import IconPicker from './IconPicker';
import FormatManager from '../../util/FormatManager';

export type IconInputProps = {
    ...InputProps,
    values?: Array<Object>,
    value?: Object,
    icon?: string,
    multi?: boolean,
    required: boolean,
    disableRemove: boolean,
    label: string,
    onValidate?: (event: React.SyntheticEvent<HTMLInputElement>) => string,
    onChange?: (event: React.SyntheticEvent<HTMLInputElement>) => void,
};

const styles = makeStyles(theme => ({
    root: {},
    label: props => ({
        backgroundColor: theme.palette.background.paper,
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(2),
        color: props.invalid ? theme.palette.error.main : theme.palette.primary.main,
    }),
    content: props => ({
        minHeight: theme.spacing(6),
        padding: theme.spacing(0.5, 0, 0.5, 1.5),
        borderColor: props.invalid ? theme.palette.error.main : theme.palette.common.gray,
        '&:hover': {
            borderColor: props.invalid ? theme.palette.error.main : theme.palette.primary.main,
        },
    }),
    chip: {
        margin: theme.spacing(0.5, 0.5, 0.5, 0),
    },
    icon: {
        marginRight: theme.spacing(1),
    },
    placeholder: {
        color: theme.palette.text.hint,
    },
    actionButton: {},
    hiddenInput: {
        position: 'absolute',
        zIndex: -9999,
        color: theme.palette.background.paper,
        backgroundColor: theme.palette.background.paper,
        marginLeft: theme.spacing(5),
        border: 0,
        width: 0,
    },
}));

const IconInput = (props: IconInputProps) => {
    const { values, label, id, name, inputRef, value, icon, placeholder, disableRemove, multi, fields, onValidate, onChange, ...rest } = props;
    const [showIcons, setShowIcons] = React.useState(false);
    const [error, setError] = React.useState('');
    const [invalid, setInvalid] = React.useState(false);
    const [selectedData, setSelectedData] = React.useState(FormatManager.defaultNull(multi ? values : value));
    const classes = styles({ invalid });
    const currentInput = inputRef || React.createRef();

    //Set value if props.value changed.
    React.useEffect(() => {
        const inputData = FormatManager.defaultNull(multi ? values : value);
        if (selectedData !== inputData) {
            handleClose(inputData);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values, value]);

    const handleClose = result => {
        setShowIcons(false);
        if (result === false) {
            return;
        }
        setSelectedData(result);
        const hasData = result && (result.id || result.length > 0);

        let errorText = '';
        if (props.required && !hasData) {
            errorText = label + " can't be blank.";
        } else if (onValidate) {
            errorText = onValidate(
                {
                    target: {
                        name: id || name,
                        value: result,
                    },
                },
                result,
            );
        }
        setError(errorText);
        currentInput.current.setCustomValidity(errorText);
        setInvalid(errorText.length > 0);

        if (onChange) {
            onChange({
                target: {
                    name: id || name,
                    value: result,
                },
            });
        }
    };

    const handleRemove = item => {
        if (!multi) {
            handleClose(null);
            return;
        }
        let updateSelection = selectedData.filter(x => x.id !== item.id);
        handleClose(updateSelection);
    };

    const handleError = error => {
        setShowIcons(false);
        setError(error);
    };

    const displayBox = () => {
        const hasData = selectedData && selectedData.length > 0;
        if (!hasData) {
            return (
                <Typography className={classes.placeholder} variant="body1">
                    {placeholder || 'Choose ' + label}
                </Typography>
            );
        }
        if (multi) {
            return (
                <>
                    {selectedData.map((item, index) => {
                        return (
                            <Chip
                                className={classes.chip}
                                key={item + '_' + index}
                                onDelete={disableRemove ? null : () => handleRemove(item)}
                                icon={<Icon>{item}</Icon>}
                                label={item}
                            />
                        );
                    })}
                </>
            );
        }
        return (
            <Chip
                className={classes.chip}
                onDelete={disableRemove ? null : () => handleRemove(selectedData)}
                icon={<Icon>{selectedData}</Icon>}
                label={selectedData}
            />
        );
    };

    return (
        <>
            <IconPicker
                title={'Choose ' + label}
                show={showIcons}
                multi={multi}
                onClose={handleClose}
                onError={handleError}
                selectedData={selectedData}
            />
            <FormControl variant="outlined" margin="normal" fullWidth className={classes.root}>
                <InputLabel className={classes.label} shrink htmlFor="bootstrap-input">
                    {label} {props.required ? '*' : ''}
                </InputLabel>
                <Paper variant="outlined" classes={{ root: classes.content }}>
                    <Grid container>
                        <Grid container item xs={10} sm={10} className={classes.chipContainer} alignItems="center">
                            {icon ? <Icon className={classes.icon}>{icon}</Icon> : null}
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    className={classes.hiddenInput}
                                    defaultValue={selectedData && (selectedData.id || selectedData.length > 0) ? JSON.stringify(selectedData) : ''}
                                    ref={currentInput}
                                    {...rest}
                                />
                                {displayBox()}
                            </div>
                        </Grid>
                        <Grid className={classes.actionButton} container item xs={2} sm={2} justify="flex-end" alignItems="center">
                            <IconButton disableRipple onClick={() => setShowIcons(true)} color="primary" aria-label="Choose">
                                <Icon>open_in_new</Icon>
                            </IconButton>
                        </Grid>
                    </Grid>
                </Paper>
                {invalid ? <FormHelperText error={invalid}>{error}</FormHelperText> : null}
            </FormControl>
        </>
    );
};

IconInput.defaultProps = {
    disableRemove: false,
};

export default IconInput;
