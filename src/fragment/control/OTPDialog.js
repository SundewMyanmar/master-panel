import React, { useState } from 'react';
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

type OTPDialogProps = {
    type: String,
    show: boolean,
    onShow: () => void,
    onSubmit: () => void,
    onResend: () => void,
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom in ref={ref} {...props} />;
});

const OTPDialog = (props: OTPDialogProps) => {
    const { type, show, onShow, onSubmit, onResend } = props;
    const [code, setCode] = useState('');
    const [timer, setTimer] = useState(null);

    const handleTimerChange = value => {
        console.log('timer change', value);
        setTimer(value);
    };

    const handleOnShow = value => {
        if (onShow) {
            onShow(value);
            setCode('');
        }
    };

    const handleCodeChange = event => {
        setCode(event.target.value);
    };

    const handleOnResend = () => {
        FormatManager.createTimer(60, 1000, handleTimerChange);
        if (onResend) onResend();
        setCode('');
    };

    const handleOnSubmit = () => {
        if (onSubmit) onSubmit(code);
        setCode('');
    };

    let inputAd =
        type == 'APP' ? null : (
            <InputAdornment position="end">
                <Button disabled={timer} variant="outlined" color="secondary" aria-label="Verify" onClick={handleOnResend}>
                    <Icon>refresh</Icon> RESEND
                </Button>
            </InputAdornment>
        );

    return (
        <Dialog
            maxWidth="xs"
            fullWidth={false}
            open={show}
            onEscapeKeyDown={() => handleOnShow(false)}
            onClose={() => handleOnShow(false)}
            TransitionComponent={Transition}
        >
            <DialogTitle>
                <Grid container>
                    <Grid container item lg={11} md={11} sm={11} xs={11} alignItems="center" justify="flex-start">
                        <Typography color="primary" variant="h6" component="h1" noWrap>
                            OTP Verification
                        </Typography>
                    </Grid>
                    <Grid container item lg={1} md={1} sm={1} xs={1} alignItems="center" justify="flex-end">
                        <Tooltip title="Close Dialog">
                            <IconButton size="small" color="primary" onClick={() => handleOnShow(false)} aria-label="Close">
                                <Icon>close</Icon>
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent>
                <TextInput
                    autoFocus
                    onChange={handleCodeChange}
                    id="code"
                    name="code"
                    label="Code"
                    required={false}
                    type="text"
                    icon="new_releases"
                    value={code}
                    inputAdornment={inputAd}
                />
                <Typography style={{ display: timer ? 'block' : 'none' }} color="primary" variant="overline" gutterBottom>
                    Please wait for {timer || ''} seconds to resend OTP again.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button style={{ marginRight: 14 }} onClick={handleOnSubmit} color="secondary" variant="contained" aria-label="Verify">
                    VERIFY
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OTPDialog;
