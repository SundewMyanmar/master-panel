/* @flow */
import * as React from 'react';
import { InputBase, Icon, Paper, makeStyles, FormControl, InputLabel, Grid, IconButton, FormHelperText, Tooltip, useTheme } from '@material-ui/core';
import ColorPicker from './ColorPicker';
import FormatManager from '../../util/FormatManager';
import type { InputBaseProps } from '@material-ui/core';

export interface ColorInputProps extends InputBaseProps {
    value?: object;
    icon?: string;
    required: boolean;
    label: string;
    display: 'full' | 'simple';
    onValidate?: (event: React.SyntheticEvent<HTMLInputElement>) => string;
    onChange?: (event: React.SyntheticEvent<HTMLInputElement>) => void;
}

const styles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
    },
    label: (props) => ({
        backgroundColor: 'inherit',
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(2),
        color: props.invalid ? theme.palette.error.main : theme.palette.text.primary,
    }),
    content: (props) => ({
        backgroundColor: 'inherit',
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
        width: 40,
        height: 25,
        marginRight: 6,
        border: '1px solid ' + theme.palette.background.divider,
    },
}));

const ColorInput = (props: ColorInputProps) => {
    const { variant, display, placeholder, label, id, name, inputRef, value, icon, onChange, onValidate, ...rest } = props;
    const [showColor, setShowColor] = React.useState(false);
    const [color, setColor] = React.useState('');
    const [error, setError] = React.useState('');
    const [invalid, setInvalid] = React.useState(false);
    const [isHover, setHover] = React.useState(false);
    const classes = styles({ invalid });
    const theme = useTheme();
    const currentInput = inputRef || React.createRef();

    React.useEffect(() => {
        const inputData = FormatManager.defaultNull(value) || value === 0 ? value : '';
        if (color !== inputData) {
            setColor(inputData);
            if (onChange) {
                onChange({
                    target: {
                        name: id || name,
                        value: inputData,
                    },
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleValueChange = (result) => {
        setShowColor(false);
        setColor(result);

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

    const handleError = (error) => {
        setShowColor(false);
        setError(error);
    };

    let variantProps = { style: { border: 'none' } };
    let inputProps = { display: 'none' };
    let boxProps = { marginTop: 8 };
    if (variant !== 'standard') {
        variantProps = {};
    }

    if (display == 'full') {
        inputProps = { display: 'block' };
        boxProps = {};
    }

    const displayBox = () => {
        return (
            <>
                {color ? (
                    <div onClick={() => setShowColor(true)} className={classes.displayBox} style={{ backgroundColor: color, ...boxProps }}></div>
                ) : (
                    <></>
                )}
            </>
        );
    };

    return (
        <>
            <ColorPicker title={'Browse ' + label} show={showColor} onClose={handleValueChange} onError={handleError} />
            <FormControl
                variant="outlined"
                margin="normal"
                fullWidth
                className={classes.root}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <InputLabel className={classes.label} shrink htmlFor="bootstrap-input">
                    {label} {props.required ? '*' : ''}
                </InputLabel>
                <Paper {...variantProps} variant="outlined" classes={{ root: classes.content }}>
                    <Grid container direction="row">
                        <Grid container item sm={8} xs={8} direction="row" className={classes.chipContainer} alignItems="center">
                            <Icon color={theme.palette.type === 'dark' ? 'default' : 'primary'} className={classes.icon}>
                                {icon || 'palette'}
                            </Icon>
                            {displayBox()}
                            <InputBase
                                style={{ width: '45%', ...inputProps }}
                                margin="dense"
                                inputProps={{ 'aria-label': 'naked' }}
                                placeholder={placeholder || 'Choose ' + label}
                                {...rest}
                                disabled
                                id={id || name}
                                name={name || id}
                                inputRef={currentInput}
                                value={color || ''}
                            />
                        </Grid>
                        <Grid
                            sm={4}
                            xs={4}
                            className={classes.actionButton}
                            container
                            item
                            justifyContent="flex-end"
                            alignItems="center"
                            direction="row"
                        >
                            {color && isHover ? (
                                <Tooltip title="Remove">
                                    <IconButton
                                        size="small"
                                        style={{ ...inputProps }}
                                        onClick={() => handleValueChange(null)}
                                        color="default"
                                        aria-label="Choose"
                                    >
                                        <Icon>close</Icon>
                                    </IconButton>
                                </Tooltip>
                            ) : null}
                            <IconButton
                                style={{ ...inputProps }}
                                disableRipple
                                onClick={() => setShowColor(true)}
                                color="default"
                                aria-label="Choose"
                            >
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

ColorInput.defaultProps = {
    variant: 'outlined',
    display: 'full',
};

export default ColorInput;
