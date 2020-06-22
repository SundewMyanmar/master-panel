/* @flow */
import * as React from 'react';
import { InputBase, InputProps, Icon, Paper, makeStyles, FormControl, InputLabel, Grid, IconButton, FormHelperText } from '@material-ui/core';
import ColorPicker from './ColorPicker';
import FormatManager from '../../util/FormatManager';

export type ColorInputProps = {
    ...InputProps,
    value?: Object,
    icon?: string,
    required: boolean,
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
    icon: {
        marginRight: theme.spacing(1),
    },
    actionButton: {},
    displayBox: {
        width: 50,
        height: 30,
        marginRight: 6,
        border: '1px solid ' + theme.palette.background.default,
    },
}));

const ColorInput = (props: ColorInputProps) => {
    const { label, id, name, inputRef, value, icon, onChange, onValidate, ...rest } = props;
    const [showColor, setShowColor] = React.useState(false);
    const [color, setColor] = React.useState('');
    const [error, setError] = React.useState('');
    const [invalid, setInvalid] = React.useState(false);
    const classes = styles({ invalid });
    const currentInput = inputRef || React.createRef();

    React.useEffect(() => {
        const inputData = FormatManager.defaultNull(value);
        if (inputData && color !== inputData) {
            handleClose(inputData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleClose = result => {
        setShowColor(false);

        if (result) setColor(result || color);

        const hasData = (result && (result.id || result.length > 0)) || (color && color.length);
        let errorText = '';
        if (props.required && !hasData) {
            errorText = label + " can't be blank.";
        } else if (onValidate) {
            errorText = onValidate(
                {
                    target: {
                        name: id || name,
                        value: result || color,
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
                    value: result || color,
                },
            });
        }
    };

    const handleError = error => {
        setShowColor(false);
        setError(error);
    };

    const displayBox = () => {
        return <>{color ? <div className={classes.displayBox} style={{ backgroundColor: color }}></div> : <></>}</>;
    };

    return (
        <>
            <ColorPicker title={'Browse ' + label} show={showColor} onClose={handleClose} onError={handleError} />
            <FormControl variant="outlined" margin="normal" fullWidth className={classes.root}>
                <InputLabel className={classes.label} shrink htmlFor="bootstrap-input">
                    {label} {props.required ? '*' : ''}
                </InputLabel>
                <Paper variant="outlined" classes={{ root: classes.content }}>
                    <Grid container>
                        <Grid container item xs={10} sm={10} className={classes.chipContainer} alignItems="center">
                            {icon ? <Icon className={classes.icon}>{icon}</Icon> : null}
                            {displayBox()}
                            <div style={{ position: 'relative' }}>
                                <InputBase
                                    margin="normal"
                                    fullWidth
                                    inputProps={{ 'aria-label': 'naked' }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    placeholder={'Choose ' + label}
                                    {...rest}
                                    disabled
                                    id={id || name}
                                    name={name || id}
                                    inputRef={currentInput}
                                    value={color || ''}
                                />
                            </div>
                        </Grid>
                        <Grid className={classes.actionButton} container item xs={2} sm={2} justify="flex-end" alignItems="center">
                            <IconButton disableRipple onClick={() => setShowColor(true)} color="primary" aria-label="Choose">
                                <Icon>palette</Icon>
                            </IconButton>
                        </Grid>
                    </Grid>
                </Paper>
                {invalid ? <FormHelperText error={invalid}>{error}</FormHelperText> : null}
            </FormControl>
        </>
    );
};

ColorInput.defaultProps = {};

export default ColorInput;
