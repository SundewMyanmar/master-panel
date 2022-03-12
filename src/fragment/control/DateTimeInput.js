import * as React from 'react';
import LuxonUtils from '@date-io/luxon';
import { DateTimePicker, MuiPickersUtilsProvider, TimePicker, DatePicker } from '@material-ui/pickers';
import { InputAdornment, Icon, makeStyles, Grid } from '@material-ui/core';
import FormatManager from '../../util/FormatManager';
import type { DateTimePickerProps } from '@material-ui/pickers';

export interface DateTimeInputProps extends DateTimePickerProps {
    value?: object;
    icon?: string;
    required: boolean;
    label: string;
    disabledLoad?: boolean;
    type: 'date' | 'time' | 'datetime';
    onChange?: (event: React.SyntheticEvent<HTMLInputElement>) => void;
}

const styles = makeStyles((theme) => ({
    root: {
        backgroundColor: 'inherit',
    },
    label: (props) => ({
        backgroundColor: 'inherit', //theme.palette.background.paper,
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
    disabledOpenIcon: {
        color: theme.palette.common.gray,
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
    picker: {
        width: '100%',
    },
}));

const DateTimeInput = (props: DateTimeInputProps) => {
    const { id, hidePlaceHolder, name, value, type, required, icon, label, disabledLoad, onChange, onValidate } = props;
    const [selectedDate, setSelectedDate] = React.useState(null);
    const [error, setError] = React.useState('');

    const classes = styles();
    const handleDateChange = (date) => {
        setSelectedDate(date);
        let event = {
            target: {
                id: id || name,
                name: id || name,
                value: date,
                type: 'datetime',
            },
        };
        let errorText = '';
        if (required && (!date || date.length <= 0)) {
            errorText = (props.label || props.name || props.id) + " can't be blank.";
        } else if (onValidate) {
            errorText = onValidate(event);
        }
        setError(errorText);

        if (onChange) {
            onChange(event);
        }
    };

    React.useEffect(() => {
        if (value && selectedDate !== value) {
            setSelectedDate(new Date(value));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const renderDateControl = () => {
        const placeholder = hidePlaceHolder ? '' : 'Enter ' + label || FormatManager.camelToReadable(id || name);
        if (type === 'time') {
            return (
                <TimePicker
                    margin="normal"
                    autoOk
                    className={classes.picker}
                    variant="inline"
                    inputVariant="outlined"
                    label={(label || 'Date Picker') + (required ? ' *' : '')}
                    placeholder={placeholder}
                    format="hh : mm a"
                    value={selectedDate}
                    disabled={disabledLoad}
                    invalidLabel={error}
                    // InputAdornmentProps={{ position: 'end' }}
                    // keyboardIcon={<Icon className={disabledLoad ? classes.disabledOpenIcon : classes.openIcon}>open_in_new</Icon>}
                    leftArrowIcon={<Icon>keyboard_arrow_left</Icon>}
                    rightArrowIcon={<Icon>keyboard_arrow_right</Icon>}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Icon>{icon || 'event'}</Icon>
                            </InputAdornment>
                        ),
                    }}
                    onChange={(date) => handleDateChange(date)}
                />
            );
        } else if (type === 'datetime') {
            return (
                <DateTimePicker
                    margin="normal"
                    autoOk
                    className={classes.picker}
                    variant="inline"
                    inputVariant="outlined"
                    label={(label || 'Date Picker') + (required ? ' *' : '')}
                    placeholder={placeholder}
                    format="dd - MM - yyyy hh : mm a"
                    value={selectedDate}
                    disabled={disabledLoad}
                    invalidLabel={error}
                    // InputAdornmentProps={{ position: 'end' }}
                    // keyboardIcon={<Icon className={disabledLoad ? classes.disabledOpenIcon : classes.openIcon}>open_in_new</Icon>}
                    leftArrowIcon={<Icon>keyboard_arrow_left</Icon>}
                    rightArrowIcon={<Icon>keyboard_arrow_right</Icon>}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Icon>{icon || 'event'}</Icon>
                            </InputAdornment>
                        ),
                    }}
                    onChange={(date) => handleDateChange(date)}
                />
            );
        } else {
            return (
                <DatePicker
                    margin="normal"
                    autoOk
                    className={classes.picker}
                    variant="inline"
                    inputVariant="outlined"
                    label={(label || 'Date Picker') + (required ? ' *' : '')}
                    placeholder={placeholder}
                    format="dd - MMM - yyyy"
                    value={selectedDate}
                    disabled={disabledLoad}
                    style={{ color: 'red' }}
                    invalidLabel={error}
                    // InputAdornmentProps={{ position: 'end' }}
                    // keyboardIcon={<Icon className={disabledLoad ? classes.disabledOpenIcon : classes.openIcon}>open_in_new</Icon>}
                    leftArrowIcon={<Icon>keyboard_arrow_left</Icon>}
                    rightArrowIcon={<Icon>keyboard_arrow_right</Icon>}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Icon>{icon || 'event'}</Icon>
                            </InputAdornment>
                        ),
                    }}
                    onChange={(date) => handleDateChange(date)}
                />
            );
        }
    };

    return (
        <>
            <MuiPickersUtilsProvider utils={LuxonUtils}>
                <Grid container justifyContent="space-around">
                    {renderDateControl()}
                </Grid>
            </MuiPickersUtilsProvider>
        </>
    );
};

export default DateTimeInput;
