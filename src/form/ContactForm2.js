import React, { useState } from 'react';
import {
    Container,
    Paper,
    Avatar,
    Icon,
    Typography,
    Grid,
    Button,
    makeStyles,
    useTheme,
    ThemeProvider,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@material-ui/core';
import DataTable from '../fragment/table';
import { TextInput, ListInput, ColorInput, IconInput, CheckboxInput, EmailInput } from '../fragment/control';
import { useDispatch } from 'react-redux';
import { ALERT_REDUX_ACTIONS } from '../util/AlertManager';
import { validateForm } from '../util/ValidationManager';
import type { GridProps } from '@material-ui/core';

export const PHONE_TABLE_FIELDS = [
    {
        name: 'label',
        label: 'Label',
    },
    {
        name: 'phoneNumber',
        label: 'PhoneNumber',
    },
    {
        name: 'isDefault',
        label: 'is Default',
        align: 'center',
        type: 'bool',
    },
];

export const EMAIL_TABLE_FIELDS = [
    {
        name: 'label',
        label: 'Label',
    },
    {
        name: 'email',
        label: 'E-mail',
    },
    {
        name: 'isDefault',
        label: 'is Default',
        align: 'center',
        type: 'bool',
    },
];

const styles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
        width: '100%',
    },
    submit: {
        marginLeft: theme.spacing(1),
    },
    accodionRoot: {
        width: '100%',
    },
    expansionIcon: {
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
    },
}));

export interface ContactForm2Props extends GridProps {
    address: Object;
    phones: Array<Object>;
    emails: Array<Object>;
    onChangeAddress: (name, value) => void;
    onChangeEmails: (Array<Object>) => void;
    onChangePhones: (Array<Object>) => void;
}

const ContactForm2 = (props: ContactForm2Props) => {
    const theme = useTheme();
    const classes = styles();
    const { address, phones, emails, onChangeAddress, onChangeEmails, onChangePhones, ...rest } = props;
    const dispatch = useDispatch();
    const [phone, setPhone] = useState({});
    const [email, setEmail] = useState({});
    const [selectedPhoneIdx, setSelectedPhoneIdx] = useState(-1);
    const [selectedEmailIdx, setSelectedEmailIdx] = useState(-1);

    const handleAddContact = () => {};
    const handleRemoveContact = (type, idx) => {
        if (type === 'phone') {
            const newPhones = phones.filter((_, i) => i !== idx);
            onChangePhones({ phones: newPhones });
        } else {
            const newEmails = emails.filter((_, i) => i !== idx);
            onChangeEmails({ emails: newEmails });
        }
    };

    return (
        <>
            <Grid className={classes.root} container {...rest}>
                <Grid container>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextInput
                            id="line1"
                            icon="home"
                            label="Address Line 1"
                            value={address.line1}
                            onChange={(event) => {
                                onChangeAddress('line1', event.target.value);
                            }}
                            required
                        />
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextInput
                            id="line2"
                            icon="signpost"
                            label="Address Line 2"
                            value={address.line2}
                            onChange={(event) => {
                                onChangeAddress('line2', event.target.value);
                            }}
                        />
                    </Grid>
                </Grid>
                <Accordion className={classes.accodionRoot} defaultExpanded={true}>
                    <AccordionSummary expandIcon={<Icon>expand_more</Icon>} aria-controls="mail-content" id="mail-header">
                        <Icon className={classes.expansionIcon}>mail</Icon>
                        <Typography>E-mail Addresses</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container>
                            <Grid container direction="row" spacing={2}>
                                <Grid item lg={3} md={3} sm={5} xs={12}>
                                    <TextInput
                                        id="emailLabel"
                                        icon="bookmark"
                                        label="Label"
                                        value={email?.label}
                                        onChange={(event) => {
                                            setEmail('label', event.target.value);
                                        }}
                                        required
                                    />
                                </Grid>
                                <Grid item lg={5} md={4} sm={7} xs={12}>
                                    <EmailInput
                                        id="email"
                                        label="E-mail"
                                        value={email?.email}
                                        onChange={(event) => {
                                            setEmail('email', event.target.value);
                                        }}
                                        required
                                    />
                                </Grid>
                                <Grid container item lg={2} md={3} sm={8} xs={12} alignItems="center" justifyContent="center">
                                    <CheckboxInput
                                        label="Is default?"
                                        value={email?.isDefault}
                                        onChange={(event) => {
                                            setEmail('isDefault', event.target.checked);
                                        }}
                                    />
                                </Grid>
                                <Grid lg={2} md={2} sm={4} xs={12} alignItems="center" container item>
                                    <Button type="submit" variant="contained" fullWidth color="secondary" onClick={() => setEmail({})}>
                                        <Icon>add</Icon>
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid container item lg={12} md={12} sm={12} xs={12}>
                                <DataTable
                                    title="Email Address"
                                    disablePaging={true}
                                    items={phones}
                                    onEdit={(item, index) => {
                                        setEmail(item);
                                        setSelectedEmailIdx(index);
                                    }}
                                    fields={[
                                        ...EMAIL_TABLE_FIELDS,
                                        {
                                            name: 'contact_remove',
                                            align: 'center',
                                            label: '@',
                                            minWidth: 50,
                                            type: 'raw',
                                            onLoad: (item, index) => (
                                                <>
                                                    <IconButton size="small" onClick={() => handleRemoveContact(phone, index)}>
                                                        <Icon color="error">delete</Icon>
                                                    </IconButton>
                                                </>
                                            ),
                                        },
                                    ]}
                                />
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
                <Accordion className={classes.accodionRoot} defaultExpanded={true}>
                    <AccordionSummary expandIcon={<Icon>expand_more</Icon>} aria-controls="phone-content" id="phone-header">
                        <Icon className={classes.expansionIcon}>phone</Icon>
                        <Typography>Phone Numbers</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container>
                            <Grid container direction="row" spacing={2}>
                                <Grid item lg={3} md={3} sm={5} xs={12}>
                                    <TextInput
                                        id="phoneLabel"
                                        icon="bookmark"
                                        label="Label"
                                        value={phone?.label}
                                        onChange={(event) => {
                                            setPhone('label', event.target.value);
                                        }}
                                        required
                                    />
                                </Grid>
                                <Grid item lg={5} md={4} sm={7} xs={12}>
                                    <TextInput
                                        id="phoneLabel"
                                        icon="phone"
                                        label="Phone Number"
                                        value={phone?.phoneNumber}
                                        onChange={(event) => {
                                            setPhone('phoneNumber', event.target.value);
                                        }}
                                        required
                                    />
                                </Grid>
                                <Grid container item lg={2} md={3} sm={8} xs={12} alignItems="center" justifyContent="center">
                                    <CheckboxInput
                                        label="Is default?"
                                        value={phone?.isDefault}
                                        onChange={(event) => {
                                            setPhone('isDefault', event.target.checked);
                                        }}
                                    />
                                </Grid>
                                <Grid lg={2} md={2} sm={4} xs={12} alignItems="center" container item>
                                    <Button type="submit" variant="contained" fullWidth color="secondary" onClick={() => setPhone({})}>
                                        <Icon>add</Icon>
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid container item lg={12} md={12} sm={12} xs={12}>
                                <DataTable
                                    title="Phone Numbers"
                                    disablePaging={true}
                                    items={phones}
                                    onEdit={(item, index) => {
                                        setPhone(item);
                                        setSelectedIdx(index);
                                    }}
                                    fields={[
                                        ...PHONE_TABLE_FIELDS,
                                        {
                                            name: 'contact_remove',
                                            align: 'center',
                                            label: '@',
                                            minWidth: 50,
                                            type: 'raw',
                                            onLoad: (item, index) => (
                                                <>
                                                    <IconButton size="small" onClick={() => handleRemoveContact(phone, index)}>
                                                        <Icon color="error">delete</Icon>
                                                    </IconButton>
                                                </>
                                            ),
                                        },
                                    ]}
                                />
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Grid>
        </>
    );
};

ContactForm2.defaultProps = {
    address: {},
    phones: [],
    emails: [],
    onChangeAddress: (data) => console.log('Address Data Changed => ', data),
    onChangeEmails: (data) => console.log('Emails Data Changed => ', data),
    onChangePhones: (data) => console.log('Phones Data Changed => ', data),
};

export default ContactForm2;
