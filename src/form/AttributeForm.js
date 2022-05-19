import React, { useState, ReactDOM, useEffect, useRef } from 'react';
import { Icon, InputAdornment, makeStyles, useTheme, Typography, FormControl, InputLabel, Paper, Accordion, AccordionSummary, AccordionDetails, Grid } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { common, primary } from '../config/Theme';
import { TABLE_FIELDS } from '../page/inventory/UnitOfMeasurement';
import UnitOfMeasurementApi from '../api/UnitOfMeasurementApi';
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
    TinyEditorInput,
    DateTimeInput,
} from '../fragment/control';

const styles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
        backgroundColor: 'inherit',
    },
    expansionIcon: {
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
    },
    submit: {
        marginLeft: theme.spacing(1),
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
}));

export interface AttributeFormProps extends GridProps {
    structure?: Array<Object>;
    data?: Array<Object>;
    onChange: (Array<Object>) => void;
}


const AttributeForm = (props: AttributeFormProps) => {
    const theme = useTheme();
    const classes = styles();
    const { id, name, data, structure, onChange, ...rest } = props;
    const dispatch = useDispatch();
    const [attribute, setAttribute] = useState({});
    const [expanded, setExpanded] = React.useState('');

    const [render, setRender] = useState(false);

    const modifyAttributes = (attrs) => {
        let result = [];

        const keys = Object.keys(attrs);
        keys.forEach((key, index) => {

            if (!key.startsWith('uom-')) {
                let obj = {};

                if (attributeData.oldAttribute && attributeData.oldAttribute['data-' + key]) obj = attributeData.oldAttribute['data-' + key];

                if (attributeData.oldAttribute && attributeData.oldAttribute['struct-' + key]) obj.attribute = attributeData.oldAttribute['struct-' + key];

                let uom = {};
                uom = {
                    uom: attrs['uom-' + key] || null
                }


                if (obj.attribute && obj.attribute.data)
                    delete obj.attribute.data;

                obj = {
                    ...obj,
                    value: attrs[key],
                    ...uom
                }

                if (obj.value)
                    result.push(obj);
            }
        });

        return result;
    }

    const handleOnChange = (event, idx) => {
        if (event.target.multiple)
            attribute[event.target.name] = event.target.values;
        else {
            if (event.target.type === 'checkbox')
                attribute[event.target.name] = event.target.checked;
            else
                attribute[event.target.name] = event.target.value;
        }

        setAttribute(attribute);
        if (onChange) {
            let value = modifyAttributes(attribute);

            onChange({
                target: {
                    id: id || name,
                    name: id || name,
                    type: 'Attribute',
                    value: value
                }
            });
        }
    }

    const [attributeData, setAttributeData] = useState(() => {
        let newStructure = {};

        let oldAttr = {};

        for (let i = 0; i < structure.length; i++) {
            let struct = structure[i];

            for (let j = 0; j < data.length; j++) {
                let d = data[j];
                if (d.attribute && d.attribute.id == struct.id) {
                    struct.data = d;
                    break;
                }
            }
            oldAttr['data-' + struct.id] = struct.data || {};
            oldAttr['struct-' + struct.id] = struct;

            struct = {
                ...struct,
                field: {
                    id: struct.id,
                    name: struct.id,
                    label: struct.name,
                    required: false,
                    onChange: handleOnChange
                }
            }
            if (i === 0) setExpanded(struct.guild);

            newStructure[struct.guild] = newStructure[struct.guild] || [];
            newStructure[struct.guild].push(struct);
        }

        return {
            oldAttribute: oldAttr,
            attributeStructure: newStructure
        };
    });

    React.useEffect(() => {
        if (attributeData.oldAttribute && attributeData.attributeStructure) {
            setRender(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attributeData]);

    const handleUOMData = async (currentPage, pageSize, sort, search) => {
        return UnitOfMeasurementApi.getPaging(currentPage, pageSize, sort, search);
    }

    const renderAttributeControl = (attr, idx) => {
        if (!attr) return <></>;
        let name = attr.data ? attr.id : '';
        let value = {};
        let uom = {};
        if (attributeData.oldAttribute && attributeData.oldAttribute['data-' + name]) {
            if (attr.type === 'LIST') {
                value = {
                    values: attributeData.oldAttribute['data-' + name].value,
                    checked: attributeData.oldAttribute['data-' + name].value,
                };
            }
            else {
                value = {
                    value: attributeData.oldAttribute['data-' + name].value,
                    checked: attributeData.oldAttribute['data-' + name].value,
                };
            }

            if (attributeData.oldAttribute && attributeData.oldAttribute['data-' + name].uom) {
                uom = {
                    value: attributeData.oldAttribute['data-' + name].uom
                }
            }
        }

        console.log('render LIST', value);

        let uomAdornment = attr.hasUom && {
            inputAdornment: <InputAdornment style={{ width: 200 }} position="end">
                <ObjectInput {...uom} hidePlaceHolder={true} variant="standard" id={'uom-' + attr.id} label="Unit" type="table" fields={TABLE_FIELDS} onLoadData={handleUOMData} onLoadItem={(item) => item.name} onChange={handleOnChange} />
            </InputAdornment>
        };

        let fieldProps = {
            ...uomAdornment,
            ...attr.field,
            ...value
        }

        switch (attr.type) {
            case 'LONG_TEXT':
                return <TextInput {...fieldProps} type="text" autoFocus={idx == 0} multiline={true} rows={4} />
            case 'HTML':
                return <>
                    <FormControl style={{
                        border: "1px solid " + common.lightGray,
                        borderRadius: 5
                    }} variant="outlined" margin="normal" fullWidth className={classes.root}>
                        <InputLabel className={classes.label} shrink htmlFor="bootstrap-input">
                            {attr.field.label}
                        </InputLabel>
                        <div classes={classes.content}>
                            <TinyEditorInput {...fieldProps}></TinyEditorInput>
                        </div>
                    </FormControl>

                </>;
            case 'COLOR':
                return <ColorInput {...fieldProps} type="text" autoFocus={idx == 0} />;
            case 'INTEGER':
                return <TextInput {...fieldProps} type="number" valid="integer" autoFocus={idx == 0} />;
            case 'FLOAT':
                return <TextInput {...fieldProps} type="number" valid="decimal" autoFocus={idx == 0} />;
            case 'DATE':
                fieldProps.value = fieldProps.value * 1;
                return <DateTimeInput type="date" {...fieldProps} autoFocus={idx == 0} />;
            case 'DATETIME':
                fieldProps.value = fieldProps.value * 1;
                return <DateTimeInput type="datetime" {...fieldProps} autoFocus={idx == 0} />;
            case 'LIST':
                return <ListInput {...fieldProps} type="list" data={attr.allowedValues} multiple={true} />;
            case 'YES_NO':
                return <CheckboxInput {...fieldProps} />;
            case 'CHOICE':
                return <ListInput {...fieldProps} type="list" data={attr.allowedValues} />
            default:
                return <TextInput {...fieldProps} type="text" autoFocus={idx == 0} />;
        }
    }
    let keys = Object.keys(attributeData.attributeStructure);

    return (
        <>
            {
                render && keys.map((obj) => {
                    return <Accordion key={`${obj}-accordion`} expanded={expanded === obj} onChange={() => setExpanded(obj)}>
                        <AccordionSummary
                            className={classes.heading}
                            expandIcon={<Icon>expand_more</Icon>}
                            aria-controls="content"
                            id={`${obj}-header`}
                            keys={obj}
                        >
                            <Icon className={classes.expansionIcon}>new_releases</Icon>
                            <Typography>{obj}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container direction="row">
                                <Grid item xs={12}>
                                    {attributeData.attributeStructure[obj] && attributeData.attributeStructure[obj].map((attr, idx) => {
                                        return renderAttributeControl(attr, idx);
                                    })}
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                })
            }
        </>
    )
}

AttributeForm.defaultProps = {
    data: [],
    onChange: (data) => console.log('Contact Data Changed => ', data),
};

export default AttributeForm;