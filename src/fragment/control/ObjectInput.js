import * as React from 'react';
import { InputProps, Icon, Paper, makeStyles, FormControl, InputLabel, Grid, IconButton, Typography, Chip, FormHelperText } from '@material-ui/core';
import { TableField } from '../table';
import TablePicker from './TablePicker';

export type ObjectInputProps = {
    ...InputProps,
    values?: Array<Object>,
    value?: Object,
    icon?: string,
    multi?: Boolean,
    fields: Array<TableField>,
    required: boolean,
    label: string,
    onLoadData(currentPage: Number, pageSize: Number, sort: String, search: String): (?Function) => Promise<Any>,
    onLoadItem(item: Object): (?Function) => string,
    onValidate(event: React.SyntheticEvent<HTMLInputElement>): (?Function) => string,
    onChange(event: React.SyntheticEvent<HTMLInputElement>): ?Function,
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

const ObjectInput = (props: ObjectInputProps) => {
    const {
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
        onValidate,
        onChange,
        onLoadData,
        onLoadItem,
        ...rest
    } = props;
    const [showTable, setShowTable] = React.useState(false);
    const [error, setError] = React.useState('');
    const [invalid, setInvalid] = React.useState(false);
    const [selectedData, setSelectedData] = React.useState(multi ? values : value);
    const classes = styles({ invalid });
    const currentInput = inputRef || React.createRef();

    //Set value if props.value changed.
    React.useEffect(() => {
        if ((values && values.length > 0) || (value && value.id)) {
            handleClose(multi ? values : value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values, value]);

    const handleClose = result => {
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

    const handleError = error => {
        setShowTable(false);
        setError(error);
    };

    const displayBox = () => {
        const hasData = selectedData && (selectedData.id || selectedData.length > 0);
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
                        const display = onLoadItem(item);
                        return <Chip className={classes.chip} key={item.id ? item.id : index} label={display} />;
                    })}
                </>
            );
        }

        const display = onLoadItem(selectedData);

        return <Typography variant="body1">{display}</Typography>;
    };

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
                onSelectionChange={result => setSelectedData(result)}
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
                            <IconButton disableRipple onClick={() => setShowTable(true)} color="primary" aria-label="Choose">
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

ObjectInput.defaultProps = {
    onLoadItem: item => {
        console.warn('Undefined OnLoadItem => ', item);
        return item.id;
    },
};

export default ObjectInput;
