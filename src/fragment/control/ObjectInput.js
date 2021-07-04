import * as React from 'react';
import { InputProps, Icon, Paper, makeStyles, FormControl, InputLabel, Grid, IconButton, Typography, Chip, FormHelperText } from '@material-ui/core';
import { TableField } from '../table';
import TablePicker from './TablePicker';
import FormatManager from '../../util/FormatManager';

export type ObjectInputProps = {
    ...InputProps,
    values?: Array<Object>,
    value?: Object,
    icon?: string,
    multi?: boolean,
    fields: Array<TableField>,
    required: boolean,
    label: string,
    disableRemove?: boolean,
    disabledLoad?: boolean,
    hidePlaceHolder: Boolean,
    onLoadData: (currentPage: number, pageSize: number, sort: string, search: string) => Promise<Any>,
    onLoadItem?: (item: Object) => string,
    onValidate?: (event: React.SyntheticEvent<HTMLInputElement>) => string,
    onChange?: (event: React.SyntheticEvent<HTMLInputElement>) => void,
};

const styles = makeStyles((theme) => ({
    root: {
        backgroundColor: 'inherit',
    },
    label: (props) => ({
        backgroundColor: theme.palette.background.paper,
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
    openIcon: {
        color: theme.palette.text.primary,
    },
    disabledOpenIcon: {
        color: theme.palette.common.gray,
    },
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

const ObjectInput = (props: ObjectInputProps) => {
    const {
        hidePlaceHolder,
        visible,
        variant,
        height,
        values,
        label,
        id,
        name,
        inputRef,
        value,
        icon,
        placeholder,
        multi,
        fields,
        disableRemove,
        disabledLoad,
        onValidate,
        onChange,
        onLoadData,
        onLoadItem,
        ...rest
    } = props;
    const [showTable, setShowTable] = React.useState(false);
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

    const handleClose = (result) => {
        setShowTable(false);
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

    const handleRemove = (item) => {
        if (!multi) {
            handleClose(null);
            return;
        }
        let updateSelection = selectedData.filter((x) => x.id !== item.id);
        handleClose(updateSelection);
    };

    const handleError = (error) => {
        setShowTable(false);
        setError(error);
    };

    const displayBox = () => {
        const hasData = selectedData && (selectedData.id || selectedData.length > 0);
        if (!hasData) {
            return (
                <Typography className={classes.placeholder} variant="body1">
                    {hidePlaceHolder || placeholder || 'Choose ' + label}
                </Typography>
            );
        }
        if (multi) {
            return (
                <>
                    {selectedData.map((item, index) => {
                        const display = onLoadItem(item);

                        return (
                            <Chip
                                {...heightProps}
                                onDelete={disableRemove ? null : () => handleRemove(item)}
                                className={classes.chip}
                                key={item.id ? item.id : index}
                                label={display}
                            />
                        );
                    })}
                </>
            );
        }

        const display = onLoadItem(selectedData);
        if (typeof display === 'object') {
            return (
                <Chip
                    onDelete={disableRemove ? null : () => handleRemove(selectedData)}
                    className={classes.chip}
                    icon={<Icon>{display.icon}</Icon>}
                    label={display.label}
                />
            );
        }

        if (disableRemove) {
            return <Typography variant="body2">{display}</Typography>;
        }

        return <Chip onDelete={disableRemove ? null : () => handleRemove(selectedData)} className={classes.chip} label={display} />;
    };

    let variantProps = { variant: variant, elevation: 0 };
    let heightProps = {};
    if (variant !== 'standard') {
        variantProps = { ...variantProps, elevation: 1 };
    }

    if (variant === 'standard' && height) heightProps = { style: { height: height } };

    let visibility = {};
    if (!visible) {
        visibility = { display: 'none' };
    }

    return (
        <>
            <TablePicker
                title={'Choose ' + label}
                show={showTable}
                multi={multi}
                onLoad={onLoadData}
                fields={fields}
                onClose={handleClose}
                onError={handleError}
                selectedData={selectedData}
                onSelectionChange={(result) => setSelectedData(result)}
            />
            <FormControl style={{ ...visibility }} {...rest} variant="outlined" margin="normal" fullWidth className={classes.root}>
                <InputLabel className={classes.label} shrink htmlFor="bootstrap-input">
                    {label} {props.required ? '*' : ''}
                </InputLabel>
                <Paper {...variantProps} classes={{ root: classes.content }}>
                    <Grid container>
                        <Grid container item xs={10} sm={10} className={classes.chipContainer} alignItems="center">
                            {icon ? (
                                <Icon color="primary" className={classes.icon}>
                                    {icon}
                                </Icon>
                            ) : null}
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
                            {
                                <IconButton
                                    disableRipple
                                    onClick={() => {
                                        disabledLoad || setShowTable(true);
                                    }}
                                    className={!disabledLoad ? classes.openIcon : classes.disabledOpenIcon}
                                    aria-label="Choose"
                                >
                                    <Icon>open_in_new</Icon>
                                </IconButton>
                            }
                        </Grid>
                    </Grid>
                </Paper>
                {invalid ? <FormHelperText error={invalid}>{error}</FormHelperText> : null}
            </FormControl>
        </>
    );
};

ObjectInput.defaultProps = {
    onLoadItem: (item) => {
        console.warn('Undefined OnLoadItem => ', item);
        return item.id;
    },
    disableRemove: false,
    disabledLoad: false,
    visible: true,
    hidePlaceHolder: false,
};

export default ObjectInput;
