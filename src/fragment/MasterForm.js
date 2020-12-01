// @flow
import React, { useState } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import {
    TextInput,
    EmailInput,
    PasswordInput,
    NumberInput,
    ImageInput,
    MultiImageInput,
    CheckboxInput,
    ListInput,
    ObjectInput,
    IconInput,
    ChipInput,
    ColorInput,
    TabControl,
    DraftEditorInput,
} from './control';
import { background } from '../config/Theme';
import { TextInputProps } from './control/TextInput';

export type Field = {
    ...TextInputProps,
    data?: Array | Object,
    onValidate?: (event: React.SyntheticEvent<HTMLInputElement>, form?: Object) => string,
};

export type GridProps = {
    row: number,
    col: number,
};

export type MasterFormProps = {
    fields: Array<Field>,
    grid: GridProps,
    type: 'form' | 'tab',
    initialData: Object,
    onWillSubmit?: (form: Object) => boolean,
    onSubmit?: (event: React.SyntheticEvent<HTMLFormElement>, form: Object) => void,
    onChange: () => void,
    onKeyDown: () => void,
};

const styles = makeStyles(theme => ({
    container: {
        backgroundColor: theme.palette.background.paper,
    },
}));

//const CHILDREN_MAPPING = [TextInput, EmailInput, PasswordInput, NumberInput, ImageInput];

const MasterForm = React.forwardRef((props: MasterFormProps, ref) => {
    const [form, setForm] = useState({});
    const classes = styles();
    const { initialData, type, variant, direction, onWillSubmit, onSubmit, onChange, onKeyDown, children, fields, ...rest } = props;

    React.useEffect(() => {
        console.log('master init', initialData);
        setForm({ ...form, ...initialData });
    }, [initialData]);

    const handleFormSubmit = event => {
        event.preventDefault();
        let allow = true;

        if (onWillSubmit) {
            allow = onWillSubmit(form);
        }

        if (allow && onSubmit) {
            onSubmit(event, form);
        }
    };

    const handleValueChange = (field, event, index) => {
        if (field.type === 'checkbox') {
            form[field.id] = event.target.checked;
        } else if (field.type === 'multi-image') {
            if (!form[field.id]) form[field.id] = [];

            if (!form[field.id][index]) {
                form[field.id].push(event.target.value);
            } else {
                form[field.id][index] = event.target.value;
            }
        } else {
            form[event.target.name] = event.target.value;
        }

        setForm(form);

        if (onChange) {
            onChange(event, index);
        }
    };

    const handleKeyDown = e => {
        if (onKeyDown) {
            onKeyDown(e);
        }
    };

    const renderControl = (type, inputProps) => {
        inputProps = { ...inputProps, variant: 'outlined' };

        switch (type) {
            case 'email':
                return <EmailInput {...inputProps} />;
            case 'password':
                return <PasswordInput {...inputProps} />;
            case 'number':
                return <NumberInput {...inputProps} />;
            case 'datetime':
                return <TextInput type="datetime-local" {...inputProps} />;
            case 'date':
                return <TextInput type="date" {...inputProps} />;
            case 'time':
                return <TextInput type="time" {...inputProps} />;
            case 'checkbox':
                return <CheckboxInput {...inputProps} />;
            case 'image':
                return <ImageInput {...inputProps} />;
            case 'multi-image': {
                return <MultiImageInput {...inputProps} />;
            }
            case 'icon':
                return <IconInput {...inputProps} />;
            case 'file':
                return <ImageInput {...inputProps} />;
            case 'list':
                return <ListInput {...inputProps} />;
            case 'table':
                return <ObjectInput {...inputProps} />;
            case 'chip':
                return <ChipInput {...inputProps} />;
            case 'color':
                return <ColorInput {...inputProps} />;
            case 'draft-editor':
                return <DraftEditorInput {...inputProps} />;
            default:
                return <TextInput type={type} {...inputProps} />;
        }
    };

    const renderTab = datas => {
        datas = datas.map(data => {
            if (data.fields) data.content = renderGrid(data.fields);

            return data;
        });

        return <TabControl centered variant={variant || 'fullWidth'} tabs={datas}></TabControl>;
    };

    const renderGrid = datas => {
        return (
            <Grid
                style={{ backgroundColor: 'inherit' }}
                direction={direction || 'column'}
                container
                alignItems={direction === 'row' ? 'center' : 'stretch'}
            >
                {datas.map((field, index) => {
                    const { type, ...inputProps } = field;
                    inputProps.key = field.id + '_' + index;
                    inputProps.name = field.name || field.id;
                    inputProps.onChange = (event, index) => handleValueChange(field, event, index);

                    if (field.onValidate) {
                        inputProps.onValidate = event => field.onValidate(event, form);
                    }

                    return (
                        <Grid className={classes.container} key={`grid_${inputProps.key}`} item>
                            {renderControl(type, inputProps)}
                        </Grid>
                    );
                })}
            </Grid>
        );
    };

    return (
        <form style={{ width: '100%' }} {...rest} ref={ref} onKeyDown={handleKeyDown} onSubmit={handleFormSubmit}>
            {type == 'tab' ? renderTab(fields) : renderGrid(fields)}
            {children}
        </form>
    );
});

MasterForm.defaultProps = {
    type: 'form',
    initialData: {},
};

export default MasterForm;
