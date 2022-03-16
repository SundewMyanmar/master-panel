import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { useDispatch } from 'react-redux';
import { ALERT_REDUX_ACTIONS } from '../../util/AlertManager';
import { FLASH_REDUX_ACTIONS } from '../../util/FlashManager';
import {
    Typography,
    Container,
    Paper,
    Avatar,
    Icon,
    makeStyles,
    Grid,
    Button,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Checkbox,
    Collapse,
    List,
    Divider,
} from '@material-ui/core';
import MasterForm from '../../fragment/MasterForm';
import SettingApi from '../../api/SettingApi';
import {
    CORS_SETTING,
    APPLE_SETTING,
    SECURITY_SETTING,
    AYAPAY_SETTING,
    CBPAY_SETTING,
    KBZPAY_SETTING,
    MPUPAY_SETTING,
    ONEPAY_SETTING,
    UABPAY_SETTING,
    WAVEPAY_SETTING,
    TELENOR_SETTING,
} from '../../config/Constant';

const styles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        padding: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        padding: theme.spacing(3),
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
    },
    submit: {
        height: 55,
        marginTop: theme.spacing(1),
    },
    expansionPanel: {
        width: '100%',
    },
    listItem: {
        padding: theme.spacing(1),
    },
    route: {
        paddingLeft: theme.spacing(4),
    },
    method: {
        paddingLeft: theme.spacing(4) * 2,
    },
    icon: {
        marginRight: theme.spacing(1),
    },
}));

const SettingManager = () => {
    const classes = styles();
    const dispatch = useDispatch();
    const [expanded, setExpanded] = useState('apple');
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    const handleError = (error) => {
        dispatch({
            type: ALERT_REDUX_ACTIONS.SHOW,
            alert: error || 'Please check your internet connection and try again.',
        });
    };
    const [cors, setCors] = useState(async () => {
        SettingApi.loadSetting(CORS_SETTING)
            .then((result) => {
                setCors(result);
            })
            .catch(handleError);

        return {};
    });
    const [apple, setApple] = useState(async () => {
        SettingApi.loadSetting(APPLE_SETTING)
            .then((result) => {
                setApple(result);
            })
            .catch(handleError);

        return {};
    });
    const [security, setSecurity] = useState(async () => {
        SettingApi.loadSetting(SECURITY_SETTING)
            .then((result) => {
                setSecurity(result);
            })
            .catch(handleError);

        return {};
    });
    const [aya, setAya] = useState(async () => {
        SettingApi.loadSetting(AYAPAY_SETTING)
            .then((result) => {
                setAya(result);
            })
            .catch(handleError);
        return {};
    });
    const [cb, setCb] = useState(async () => {
        SettingApi.loadSetting(CBPAY_SETTING)
            .then((result) => {
                setCb(result);
            })
            .catch(handleError);

        return {};
    });
    const [kbz, setKbz] = useState(async () => {
        SettingApi.loadSetting(KBZPAY_SETTING)
            .then((result) => {
                setKbz(result);
            })
            .catch(handleError);

        return {};
    });
    const [mpu, setMpu] = useState(async () => {
        SettingApi.loadSetting(MPUPAY_SETTING)
            .then((result) => {
                setMpu(result);
            })
            .catch(handleError);

        return {};
    });
    const [onePay, setOnePay] = useState(async () => {
        SettingApi.loadSetting(ONEPAY_SETTING)
            .then((result) => {
                setOnePay(result);
            })
            .catch(handleError);

        return {};
    });
    const [uab, setUab] = useState(async () => {
        SettingApi.loadSetting(UABPAY_SETTING)
            .then((result) => {
                setUab(result);
            })
            .catch(handleError);

        return {};
    });
    const [wave, setWave] = useState(async () => {
        SettingApi.loadSetting(WAVEPAY_SETTING)
            .then((result) => {
                setWave(result);
            })
            .catch(handleError);

        return {};
    });
    const [telenor, setTelenor] = useState(async () => {
        SettingApi.loadSetting(TELENOR_SETTING)
            .then((result) => {
                setTelenor(result);
            })
            .catch(handleError);

        return {};
    });

    const corsConfig = [
        {
            id: 'allowedOriginPatterns',
            label: 'Allowed Origin Patterns',
            icon: 'code',
            required: false,
            type: 'text',
            value: cors.allowedOriginPatterns,
        },
        {
            id: 'allowedOrigins',
            label: 'Allowed Origins',
            icon: 'code',
            required: false,
            type: 'text',
            value: cors.allowedOrigins,
        },
        {
            id: 'allowedMethods',
            label: 'Allowed Methods',
            icon: 'code',
            required: false,
            type: 'text',
            value: cors.allowedMethods,
        },
        {
            id: 'allowedHeaders',
            label: 'Allowed Headers',
            icon: 'code',
            required: false,
            type: 'text',
            value: cors.allowedHeaders,
        },
        {
            id: 'exposedHeaders',
            label: 'Exposed Headers',
            icon: 'code',
            required: false,
            type: 'text',
            value: cors.exposedHeaders,
        },
        {
            id: 'allowedCredential',
            label: 'Allowed Credentials',
            icon: 'code',
            required: false,
            type: 'text',
            value: cors.allowedCredential,
        },
    ];

    const appleConfig = [
        {
            id: 'teamId',
            label: 'Team ID',
            icon: 'code',
            required: false,
            type: 'text',
            value: apple.teamId,
        },
        {
            id: 'appId',
            label: 'App ID',
            icon: 'code',
            required: false,
            type: 'text',
            value: apple.appId,
        },
        {
            id: 'privateKey ',
            label: 'Private Key',
            icon: 'code',
            required: false,
            type: 'text',
            value: apple.privateKey,
        },
    ];

    const securityConfig = [
        {
            id: 'ownerIds',
            label: 'Owner IDs',
            icon: 'code',
            required: false,
            type: 'text',
            value: security.ownerIds,
        },
        {
            id: 'authTokenDayOfLife',
            label: 'Auth Token Day Of Life',
            icon: 'code',
            required: false,
            type: 'text',
            value: security.authTokenDayOfLife,
        },
        {
            id: 'requireConfirm',
            label: 'Require Confirm',
            icon: 'code',
            required: false,
            type: 'text',
            value: security.requireConfirm,
        },
        {
            id: 'authFailedCount',
            label: 'Auth Fail Count',
            icon: 'code',
            required: false,
            type: 'text',
            value: security.authFailedCount,
        },
        {
            id: 'authFailedMinuteOfBlock',
            label: 'Auth Failed Minute Of Block',
            icon: 'code',
            required: false,
            type: 'text',
            value: security.authFailedMinuteOfBlock,
        },
        {
            id: 'clientRole',
            label: 'Client Role',
            icon: 'code',
            required: false,
            type: 'text',
            value: security.clientRole,
        },
        {
            id: 'adminRole',
            label: 'Admin Role',
            icon: 'code',
            required: false,
            type: 'text',
            value: security.adminRole,
        },
        {
            id: 'cookieDomain',
            label: 'Cookie Domain',
            icon: 'code',
            required: false,
            type: 'text',
            value: security.cookieDomain,
        },
        {
            id: 'cookieDomainPattern',
            label: 'Cookie Domain Pattern',
            icon: 'code',
            required: false,
            type: 'text',
            value: security.cookieDomainPattern,
        },
        {
            id: 'cookiePath',
            label: 'Cookie Path',
            icon: 'code',
            required: false,
            type: 'text',
            value: security.cookiePath,
        },
        {
            id: 'csrfEnable',
            label: 'CSRF Enable',
            icon: 'code',
            required: false,
            type: 'text',
            value: security.csrfEnable,
        },
    ];

    const ayaConfig = [
        {
            id: 'url',
            label: 'URL',
            icon: 'code',
            required: false,
            type: 'text',
            value: aya.url,
        },
        {
            id: 'consumerKey',
            label: 'Consumer Key',
            icon: 'code',
            required: false,
            type: 'text',
            value: aya.consumerKey,
        },
        {
            id: 'consumerSecret',
            label: 'Consumer Secret',
            icon: 'code',
            required: false,
            type: 'text',
            value: aya.consumerSecret,
        },
        {
            id: 'decryptionKey',
            label: 'Decryption Key',
            icon: 'code',
            required: false,
            type: 'text',
            value: aya.decryptionKey,
        },
        {
            id: 'userId',
            label: 'User ID',
            icon: 'code',
            required: false,
            type: 'text',
            value: aya.userId,
        },
        {
            id: 'phone',
            label: 'Phone',
            icon: 'code',
            required: false,
            type: 'text',
            value: aya.phone,
        },
        {
            id: 'pin',
            label: 'Pin',
            icon: 'code',
            required: false,
            type: 'text',
            value: aya.pin,
        },
        {
            id: 'currency',
            label: 'Currency',
            icon: 'code',
            required: false,
            type: 'text',
            value: aya.currency,
        },
    ];

    const cbConfig = [
        {
            id: 'url',
            label: 'URL',
            icon: 'code',
            required: false,
            type: 'text',
            value: cb.url,
        },
        {
            id: 'authToken',
            label: 'Auth Token',
            icon: 'code',
            required: false,
            type: 'text',
            value: cb.authToken,
        },
        {
            id: 'ecommerceId',
            label: 'Ecommerce ID',
            icon: 'code',
            required: false,
            type: 'text',
            value: cb.ecommerceId,
        },
        {
            id: 'subMerId',
            label: 'Sub Merchant ID',
            icon: 'code',
            required: false,
            type: 'text',
            value: cb.subMerId,
        },
        {
            id: 'currency',
            label: 'Currency',
            icon: 'code',
            required: false,
            type: 'text',
            value: cb.currency,
        },
        {
            id: 'app',
            label: 'App',
            icon: 'code',
            required: false,
            type: 'text',
            value: cb.app,
        },
    ];

    const kbzConfig = [
        {
            id: 'url',
            label: 'URL',
            icon: 'code',
            required: false,
            type: 'text',
            value: kbz.url,
        },
        {
            id: 'version',
            label: 'Version',
            icon: 'code',
            required: false,
            type: 'text',
            value: kbz.version,
        },
        {
            id: 'appId',
            label: 'App ID',
            icon: 'code',
            required: false,
            type: 'text',
            value: kbz.appId,
        },
        {
            id: 'merchantCode',
            label: 'Merchant Code',
            icon: 'code',
            required: false,
            type: 'text',
            value: kbz.merchantCode,
        },
        {
            id: 'merchantName',
            label: 'Merchant Name',
            icon: 'code',
            required: false,
            type: 'text',
            value: kbz.merchantName,
        },
        {
            id: 'secretKey',
            label: 'Secret Key',
            icon: 'code',
            required: false,
            type: 'text',
            value: kbz.secretKey,
        },
        {
            id: 'isUat',
            label: 'Is Uat?',
            icon: 'code',
            required: false,
            type: 'text',
            value: kbz.isUat,
        },
    ];

    const mpuConfig = [
        {
            id: 'url',
            label: 'URL',
            icon: 'code',
            required: false,
            type: 'text',
            value: mpu.url,
        },
        {
            id: 'merchantId',
            label: 'Merchant ID',
            icon: 'code',
            required: false,
            type: 'text',
            value: mpu.merchantId,
        },
        {
            id: 'secretKey',
            label: 'Secret Key',
            icon: 'code',
            required: false,
            type: 'text',
            value: mpu.secretKey,
        },
        {
            id: 'version',
            label: 'Version',
            icon: 'code',
            required: false,
            type: 'text',
            value: mpu.version,
        },
        {
            id: 'successUrl',
            label: 'Success Url',
            icon: 'code',
            required: false,
            type: 'text',
            value: mpu.successUrl,
        },
    ];

    const onepayConfig = [
        {
            id: 'url',
            label: 'URL',
            icon: 'code',
            required: false,
            type: 'text',
            value: onePay.url,
        },
        {
            id: 'user',
            label: 'User ID',
            icon: 'code',
            required: false,
            type: 'text',
            value: onePay.user,
        },
        {
            id: 'secretKey',
            label: 'Secret Key',
            icon: 'code',
            required: false,
            type: 'text',
            value: onePay.secretKey,
        },
        {
            id: 'channel',
            label: 'Channel',
            icon: 'code',
            required: false,
            type: 'text',
            value: onePay.channel,
        },
        {
            id: 'version',
            label: 'Version',
            icon: 'code',
            required: false,
            type: 'text',
            value: onePay.version,
        },
        {
            id: 'expSeconds',
            label: 'Exp Seconds',
            icon: 'code',
            required: false,
            type: 'text',
            value: onePay.expSeconds,
        },
    ];

    const uabConfig = [
        {
            id: 'url',
            label: 'URL',
            icon: 'code',
            required: false,
            type: 'text',
            value: uab.url,
        },
        {
            id: 'user',
            label: 'User ID',
            icon: 'code',
            required: false,
            type: 'text',
            value: uab.user,
        },
        {
            id: 'password',
            label: 'Password',
            icon: 'code',
            required: false,
            type: 'text',
            value: uab.password,
        },
        {
            id: 'secretKey',
            label: 'Secret Key',
            icon: 'code',
            required: false,
            type: 'text',
            value: uab.secretKey,
        },
        {
            id: 'channel',
            label: 'Channel',
            icon: 'code',
            required: false,
            type: 'text',
            value: uab.channel,
        },
        {
            id: 'appName',
            label: 'App Name',
            icon: 'code',
            required: false,
            type: 'text',
            value: uab.appName,
        },
        {
            id: 'expSeconds',
            label: 'Expired Seconds',
            icon: 'code',
            required: false,
            type: 'text',
            value: uab.expSeconds,
        },
    ];

    const waveConfig = [
        {
            id: 'url',
            label: 'URL',
            icon: 'code',
            required: false,
            type: 'text',
            value: wave.url,
        },
        {
            id: 'merchantId',
            label: 'Merchant ID',
            icon: 'code',
            required: false,
            type: 'text',
            value: wave.merchantId,
        },
        {
            id: 'merchantName',
            label: 'Merchant Name',
            icon: 'code',
            required: false,
            type: 'text',
            value: wave.merchantName,
        },
        {
            id: 'secretKey',
            label: 'Secret Key',
            icon: 'code',
            required: false,
            type: 'text',
            value: wave.secretKey,
        },
        {
            id: 'expSeconds',
            label: 'Expired Seconds',
            icon: 'code',
            required: false,
            type: 'text',
            value: wave.expSeconds,
        },
        {
            id: 'successUrl',
            label: 'Success Url',
            icon: 'code',
            required: false,
            type: 'text',
            value: wave.successUrl,
        },
    ];

    const telenorConfig = [
        {
            id: 'status',
            label: 'Status',
            icon: 'code',
            required: false,
            type: 'text',
            value: telenor.status,
        },
        {
            id: 'accessToken',
            label: 'Access Token',
            icon: 'code',
            required: false,
            type: 'text',
            value: telenor.accessToken,
        },
        {
            id: 'refreshToken',
            label: 'Refresh Token',
            icon: 'code',
            required: false,
            type: 'text',
            value: telenor.refreshToken,
        },
        {
            id: 'scope',
            label: 'Scope',
            icon: 'code',
            required: false,
            type: 'text',
            value: telenor.scope,
        },
        {
            id: 'tokenType',
            label: 'Token Type',
            icon: 'code',
            required: false,
            type: 'text',
            value: telenor.tokenType,
        },
        {
            id: 'expiresIn',
            label: 'Expired In',
            icon: 'code',
            required: false,
            type: 'text',
            value: telenor.expiresIn,
        },
        {
            id: 'expiredDate',
            label: 'Expired Date',
            icon: 'code',
            required: false,
            type: 'text',
            value: telenor.expiredDate,
        },
    ];

    const handleSubmit = (data, name) => {
        dispatch({ type: ALERT_REDUX_ACTIONS.SHOW_LOADING });
        SettingApi.saveSetting(data, name)
            .then((savedData) => {
                dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
                dispatch({ type: FLASH_REDUX_ACTIONS.SHOW, flash: { type: 'success', message: 'Save successful.' } });
            })
            .catch(handleError);
        console.log('submit', data, name);
    };

    const createAccordion = (acc, icon, title, fields, fieldOnChange, onSubmit) => {
        return (
            <Accordion expanded={expanded === acc} onChange={handleChange(acc)}>
                <AccordionSummary expandIcon={<Icon>expand_more</Icon>} aria-controls="panel1bh-content" id="panel1bh-header">
                    <Icon className={classes.icon}>{icon}</Icon>
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>{title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <MasterForm fields={fields} onChange={fieldOnChange}>
                        <Grid container justifyContent="flex-end">
                            <Button type="button" onClick={() => onSubmit()} variant="contained" color="primary" className={classes.submit}>
                                <Icon>save</Icon> Save
                            </Button>
                        </Grid>
                    </MasterForm>
                </AccordionDetails>
            </Accordion>
        );
    };

    const accordionConfigs = [
        {
            acc: 'apple',
            icon: 'apple',
            title: 'Apple Auth Settings',
            config: appleConfig,
            onChange: (event, data) => {
                setApple({
                    ...apple,
                    [event.target.name]: event.target.value,
                });
            },
            onSubmit: () => handleSubmit(apple, APPLE_SETTING),
        },
        {
            acc: 'aya',
            icon: 'credit_card',
            title: 'AYA Pay Settings',
            config: ayaConfig,
            onChange: (event, data) => {
                setAya({
                    ...aya,
                    [event.target.name]: event.target.value,
                });
            },
            onSubmit: () => handleSubmit(aya, AYAPAY_SETTING),
        },
        {
            acc: 'cb',
            icon: 'credit_card',
            title: 'CB Pay Settings',
            config: cbConfig,
            onChange: (event, data) => {
                setCb({
                    ...cb,
                    [event.target.name]: event.target.value,
                });
            },
            onSubmit: () => handleSubmit(cb, CBPAY_SETTING),
        },
        {
            acc: 'kbz',
            icon: 'credit_card',
            title: 'KBZ Pay Settings',
            config: kbzConfig,
            onChange: (event, data) => {
                setKbz({
                    ...kbz,
                    [event.target.name]: event.target.value,
                });
            },
            onSubmit: () => handleSubmit(kbz, KBZPAY_SETTING),
        },
        {
            acc: 'mpu',
            icon: 'credit_card',
            title: 'MPU Pay Settings',
            config: mpuConfig,
            onChange: (event, data) => {
                setMpu({
                    ...mpu,
                    [event.target.name]: event.target.value,
                });
            },
            onSubmit: () => handleSubmit(mpu, MPUPAY_SETTING),
        },
        {
            acc: 'onepay',
            icon: 'credit_card',
            title: 'One Pay Settings',
            config: onepayConfig,
            onChange: (event, data) => {
                setOnePay({
                    ...onePay,
                    [event.target.name]: event.target.value,
                });
            },
            onSubmit: () => handleSubmit(onePay, ONEPAY_SETTING),
        },
        {
            acc: 'uab',
            icon: 'credit_card',
            title: 'UAB Pay Settings',
            config: uabConfig,
            onChange: (event, data) => {
                setUab({
                    ...uab,
                    [event.target.name]: event.target.value,
                });
            },
            onSubmit: () => handleSubmit(uab, UABPAY_SETTING),
        },
        {
            acc: 'wave',
            icon: 'credit_card',
            title: 'Wave Pay Settings',
            config: waveConfig,
            onChange: (event, data) => {
                setWave({
                    ...wave,
                    [event.target.name]: event.target.value,
                });
            },
            onSubmit: () => handleSubmit(wave, WAVEPAY_SETTING),
        },
        {
            acc: 'telenor',
            icon: 'message_processing',
            title: 'Telenor Messaging Settings',
            config: telenorConfig,
            onChange: (event, data) => {
                setTelenor({
                    ...telenor,
                    [event.target.name]: event.target.value,
                });
            },
            onSubmit: () => handleSubmit(telenor, TELENOR_SETTING),
        },
        {
            acc: 'cors',
            icon: 'settings_input_composite',
            title: 'CORS Settings',
            config: corsConfig,
            onChange: (event, data) => {
                setCors({
                    ...cors,
                    [event.target.name]: event.target.value,
                });
            },
            onSubmit: () => handleSubmit(cors, CORS_SETTING),
        },
        {
            acc: 'security',
            icon: 'security',
            title: 'Security Settings',
            config: securityConfig,
            onChange: (event, data) => {
                setSecurity({
                    ...security,
                    [event.target.name]: event.target.value,
                });
            },
            onSubmit: () => handleSubmit(security, SECURITY_SETTING),
        },
    ];

    return (
        <>
            <Container component="main" maxWidth="md">
                <Accordion>
                    <AccordionSummary aria-controls="panel1bh-content" id="panel1bh-header">
                        <Icon className={classes.icon}>settings</Icon>
                        <Typography sx={{ width: '33%', flexShrink: 0 }}>System Settings</Typography>
                    </AccordionSummary>
                </Accordion>
                {accordionConfigs.map((acc) => {
                    return createAccordion(acc.acc, acc.icon, acc.title, acc.config, acc.onChange, acc.onSubmit);
                })}
            </Container>
        </>
    );
};

export default withRouter(SettingManager);
