import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    Zoom,
    InputAdornment,
    Tooltip,
    IconButton,
    Icon,
    Grid,
    Button,
    DialogTitle,
    Typography,
} from '@material-ui/core';
import FormatManager from '../../util/FormatManager';
import TextInput from './TextInput';
import MfaApi from '../../api/MfaApi';
import { useSelector } from 'react-redux';

type OTPDialogProps = {
    userId: number,
    mfaKey: string,
    show: boolean,
    onClose: () => void,
    onSubmit: () => void,
};

const RESEND_TIMER = 60;

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom in ref={ref} {...props} />;
});

const OTPDialog = (props: OTPDialogProps) => {
    const { show, onClose, onSubmit, mfaKey, userId } = props;
    const [code, setCode] = useState('');
    const [timer, setTimer] = useState(mfaKey ? RESEND_TIMER : 0);

    const handleTimer = () => {
        setTimer(timer - 1);
    };

    useEffect(() => {
        if (show && timer > 0) {
            const timerId = setInterval(handleTimer, 1000);
            return () => {
                clearInterval(timerId);
            };
        }

        // eslint-disable-next-line
    }, [timer]);

    const handleOnClose = (value) => {
        if (onClose) {
            onClose(value);
            setTimer(0);
            setCode('');
        }
    };

    const handleCodeChange = (event) => {
        setCode(event.target.value);
    };

    const handleOnResend = () => {
        if (mfaKey && userId) {
            MfaApi.resend(userId, mfaKey)
                .then((resp) => {
                    setTimer(RESEND_TIMER);
                    setCode('');
                })
                .catch((error) => {
                    dispatch({
                        type: ALERT_REDUX_ACTIONS.SHOW,
                        alert: error || 'Please check your internet connection and try again.',
                    });
                });
        }
    };

    const handleOnSubmit = () => {
        if (onSubmit) onSubmit(code);
        setCode('');
    };

    const resendButton =
        mfaKey && userId ? (
            <InputAdornment position="end">
                <IconButton name="refresh"></IconButton>
                <Button disabled={timer > 0} variant="outlined" color="secondary" aria-label="Verify" onClick={handleOnResend}>
                    <Icon>refresh</Icon> {timer > 0 ? timer + ' SEC' : 'RESEND'}
                </Button>
            </InputAdornment>
        ) : null;

    return (
        <Dialog maxWidth="xs" fullWidth={false} open={show} onClose={() => handleOnClose(false)} TransitionComponent={Transition}>
            <DialogTitle>
                <Grid container>
                    <Grid container item lg={11} md={11} sm={11} xs={11} alignItems="center" justifyContent="flex-start">
                        <Typography color="primary" variant="h6" component="h1" noWrap>
                            OTP Verification
                        </Typography>
                    </Grid>
                    <Grid container item lg={1} md={1} sm={1} xs={1} alignItems="center" justifyContent="flex-end">
                        <Tooltip title="Close Dialog">
                            <IconButton size="small" color="primary" onClick={() => handleOnClose(false)} aria-label="Close">
                                <Icon>close</Icon>
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent>
                <TextInput
                    onChange={handleCodeChange}
                    id="code"
                    name="code"
                    label="Code"
                    required={false}
                    type="text"
                    icon="new_releases"
                    value={code}
                    inputAdornment={resendButton}
                    autoFocus={true}
                />
                <Typography style={{ display: timer > 0 ? 'block' : 'none' }} color="primary" variant="overline" gutterBottom>
                    Please wait for {timer || ''} seconds to resend OTP again.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button style={{ marginRight: 14 }} onClick={handleOnSubmit} color="primary" variant="contained" aria-label="Verify">
                    VERIFY
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OTPDialog;
