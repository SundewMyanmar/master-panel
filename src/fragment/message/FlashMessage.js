import * as React from 'react';
import { Snackbar, Slide } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { STORAGE_KEYS } from '../../config/Constant';
import { useDispatch, useSelector } from 'react-redux';
import { FLASH_REDUX_ACTIONS } from '../../util/FlashManager';
import { ALERT_REDUX_ACTIONS } from '../../util/AlertManager';
import type { SnackbarProps } from '@material-ui/core';

export interface Position {
    vertical: 'top' | 'bottom';
    position: 'left' | 'center' | 'right';
}

export interface FlashMessageProps extends SnackbarProps {
    position?: Position;
    type: 'success' | 'warning' | 'error' | 'info';
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FlashMessage(props: FlashMessageProps) {
    const dispatch = useDispatch();
    const flash = useSelector((state) => state.flash);
    const { position, type, ...rest } = props;

    const handleFlashMessage = () => {
        dispatch({ type: FLASH_REDUX_ACTIONS.HIDE });
    };

    return (
        <Snackbar
            anchorOrigin={position}
            open={flash.show}
            autoHideDuration={flash.duration || 3000}
            onClose={handleFlashMessage}
            TransitionComponent={Transition}
            TransitionProps={{ onExited: handleFlashMessage }}
            {...rest}
        >
            <Alert onClose={handleFlashMessage} severity={flash.type || type || 'info'} variant="filled" elevation={6}>
                {flash.title ? <AlertTitle>{flash.title}</AlertTitle> : null}
                {flash.message || flash.title || flash.toString()}
            </Alert>
        </Snackbar>
    );
}

FlashMessage.defaultProps = {
    position: { vertical: 'bottom', horizontal: 'right' },
};
