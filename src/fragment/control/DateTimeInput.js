import * as React from 'react';
import LuxonUtils from '@date-io/luxon';
import { MuiPickersUtilsProvider, KeyboardDateTimePicker, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import { InputAdornment, Icon, makeStyles, Grid, useTheme } from '@material-ui/core';
import FormatManager from '../../util/FormatManager';
import type { DateTimePickerProps } from '@material-ui/pickers';

export interface DateTimeInputProps extends DateTimePickerProps {
    value?: object;
    icon?: string;
    required: boolean;
    label: string;
    disabled?: boolean;
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

const DEFAULT_FORMAT = {
    date: 'dd-MM-yyyy',
    time: 'HH:mm',
    datetime: 'dd-MM-yyyy HH:mm',
};

const DateTimeInput = (props: DateTimeInputProps) => {
    const { id, hidePlaceHolder, name, value, type, required, icon, label, disabled, onChange, onValidate } = props;
    const [selectedDate, setSelectedDate] = React.useState(null);
    const [error, setError] = React.useState('');

    const classes = styles();
    const theme = useTheme();
    const handleDateChange = (date) => {
        setSelectedDate(date);
        let event = {
            target: {
                id: id || name,
                name: id || name,
                value: date?.toMillis(),
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
        if (selectedDate !== value) {
            if (value) {
                if (typeof value === 'number') {
                    setSelectedDate(new Date(value));
                } else if (typeof value === 'string' && type === 'time') {
                    const luxonDate = FormatManager.toDate(value, 'HH:mm:ss');
                    setSelectedDate(luxonDate.toJSDate());
                }
            } else {
                setSelectedDate(null);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const renderDateControl = () => {
        const placeholder = hidePlaceHolder ? '' : 'Enter ' + label || FormatManager.camelToReadable(id || name);
        const standard_props = {
            id: id || name,
            onChange: handleDateChange,
            autoOk: true,
            margin: 'normal',
            className: classes.picker,
            inputVariant: 'outlined',
            placeholder: placeholder,
            format: DEFAULT_FORMAT[type],
            value: selectedDate,
            disabled: disabled,
            invalidLabel: error,
            KeyboardButtonProps: {
                style: { padding: 0 },
            },
            keyboardIcon: disabled ? null : <Icon>open_in_new</Icon>,
            InputProps: {
                startAdornment: (
                    <InputAdornment position="start">
                        <Icon>{icon || 'event'}</Icon>
                    </InputAdornment>
                ),
            },
        };
        if (type === 'time') {
            return <KeyboardTimePicker label={(label || 'Time Picker') + (required ? ' *' : '')} {...standard_props} />;
        } else if (type === 'datetime') {
            return <KeyboardDateTimePicker label={(label || 'Datetime Picker') + (required ? ' *' : '')} {...standard_props} />;
        } else {
            return <KeyboardDatePicker label={(label || 'Date Picker') + (required ? ' *' : '')} {...standard_props} />;
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
