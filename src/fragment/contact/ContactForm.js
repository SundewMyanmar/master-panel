import React, { useState } from 'react';
import ListInput from '../control/ListInput';
import TextInput from '../control/TextInput';
import { Container, Paper, Avatar, Icon, Typography, Grid, Button, makeStyles, useTheme, ThemeProvider, IconButton } from '@material-ui/core';
import DataTable from '../table';
import { ColorInput, IconInput } from '../control';
import { useDispatch } from 'react-redux';
import { ALERT_REDUX_ACTIONS } from '../../util/AlertManager';

export const CONTACT_TABLE_FIELDS = [
    {
        name: 'color',
        label: 'Tag Color',
        type: 'color',
    },
    {
        name: 'type',
        label: 'Type',
    },
    {
        name: 'icon',
        label: 'icon',
        type: 'icon',
        onLoad: (data) => {
            if (!data.icon) {
                const defType = CONTACT_TYPES[data.type];
                if (defType) {
                    return defType.icon;
                }
            }
            return data.icon;
        },
    },
    {
        name: 'label',
        label: 'Label',
    },
    {
        name: 'value',
        label: 'value',
    },
];

export const CONTACT_TYPES = {
    PHONE: {
        icon: 'phone',
    },
    SMS: {
        icon: 'sms',
    },
    EMAIL: {
        icon: 'email',
    },
    URL: {
        icon: 'language',
    },
    ADDRESS: {
        icon: 'map',
    },
    LAT_LON: {
        icon: 'location_on',
    },
    MESSAGING_ID: {
        icon: 'mms',
    },
    SOCIAL_ID: {
        icon: 'settings_ethernet',
    },
};

const styles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}));

export type ContactFormProps = {
    data?: Array<Object>,
    onChange: (Array<Object>) => void,
};

const ContactForm = (props: ContactFormProps) => {
    const theme = useTheme();
    const classes = styles();
    const { data, onChange, ...rest } = props;
    const dispatch = useDispatch();
    const [contact, setContact] = useState({});
    const [selectedIdx, setSelectedIdx] = useState(-1);
    const [icon, setIcon] = useState('phone');

    const handleInputChange = (key, value) => {
        if (key === 'type' && value) {
            setIcon(CONTACT_TYPES[value].icon);
        }
        if (key === 'icon') {
            setIcon(value);
        }

        setContact({ ...contact, [key]: value });
    };

    const handleSaveContact = () => {
        if (!contact.type || contact.type.length <= 0) {
            dispatch({
                type: ALERT_REDUX_ACTIONS.SHOW,
                alert: { type: 'warning', message: 'Contact type is required!' },
            });
            return;
        }

        if (!contact.label || contact.label.length <= 0) {
            dispatch({
                type: ALERT_REDUX_ACTIONS.SHOW,
                alert: { type: 'warning', message: 'Contact Label is required!' },
            });
            return;
        }

        if (!contact.value || contact.value.length <= 0) {
            dispatch({
                type: ALERT_REDUX_ACTIONS.SHOW,
                alert: { type: 'warning', message: 'Contact value is required!' },
            });
            return;
        }

        if (onChange) {
            if (selectedIdx >= 0) {
                data[selectedIdx] = contact;
                onChange(data);
            } else {
                onChange([...data, contact]);
            }

            setContact({});
            setSelectedIdx(-1);
        }
    };

    const handleRemoveContact = (index) => {
        if (onChange) {
            data.splice(index, 1);
            onChange(data);
        }
    };

    return (
        <>
            <Grid className={classes.root} container spacing={4} {...rest}>
                <Grid container>
                    <Grid container direction="row" spacing={2}>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <ListInput
                                label="Contact Type"
                                id="contactType"
                                data={Object.keys(CONTACT_TYPES)}
                                value={contact?.type}
                                onChange={(event) => {
                                    handleInputChange('type', event.target.value);
                                }}
                                required
                            />
                        </Grid>
                        <Grid item lg={9} md={8} sm={6} xs={12}>
                            <TextInput
                                id="contactLabel"
                                icon="bookmark"
                                label="Contact Label"
                                value={contact?.label}
                                onChange={(event) => {
                                    handleInputChange('label', event.target.value);
                                }}
                                required
                            />
                        </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={2}>
                        <Grid item lg={5} md={6} sm={6} xs={12}>
                            <IconInput
                                id="contactIcon"
                                label="Contact Icon"
                                value={contact?.icon}
                                onChange={(event) => {
                                    handleInputChange('icon', event.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item lg={7} md={6} sm={6} xs={12}>
                            <ColorInput
                                label="Color"
                                id="contactColor"
                                value={contact?.color}
                                onChange={(event) => {
                                    handleInputChange('color', event.target.value);
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={1}>
                        <Grid item lg={10} md={10} sm={8} xs={12}>
                            <TextInput
                                id="contactValue"
                                icon={icon || 'phone'}
                                label="Contact Value"
                                value={contact?.value}
                                onChange={(event) => {
                                    handleInputChange('value', event.target.value);
                                }}
                                required
                            />
                        </Grid>
                        <Grid container item lg={2} md={2} sm={4} xs={12} justifyContent="flex-end" alignItems="center">
                            <Button type="submit" size="large" variant="contained" color="primary" onClick={handleSaveContact}>
                                <Icon>{selectedIdx < 0 ? 'add' : 'save'}</Icon> {selectedIdx < 0 ? 'Add' : 'Update'}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container>
                    <DataTable
                        title="User Contacts"
                        disablePaging={true}
                        items={data}
                        onEdit={(item, index) => {
                            setContact(item);
                            setSelectedIdx(index);
                        }}
                        fields={[
                            ...CONTACT_TABLE_FIELDS,
                            {
                                name: 'contact_remove',
                                align: 'center',
                                label: '@',
                                minWidth: 50,
                                type: 'raw',
                                onLoad: (item, index) => (
                                    <>
                                        <IconButton size="small" onClick={() => handleRemoveContact(index)}>
                                            <Icon color="error">delete</Icon>
                                        </IconButton>
                                    </>
                                ),
                            },
                        ]}
                    />
                </Grid>
            </Grid>
        </>
    );
};

ContactForm.defaultProps = {
    data: [],
    onChange: (data) => console.log('Contact Data Changed => ', data),
};

export default ContactForm;
