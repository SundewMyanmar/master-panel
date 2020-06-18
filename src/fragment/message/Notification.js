import * as React from 'react';
import { Snackbar, Slide } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { STORAGE_KEYS } from '../../config/Constant';

export type Position = {
    vertical: 'top' | 'bottom',
    position: 'left' | 'center' | 'right',
};

export type NotificationProps = {
    show: boolean,
    message: string,
    title?: string,
    onClose?: () => void,
    position?: Position,
    type: 'success' | 'warning' | 'error' | 'info',
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function NotiMessage(props: NotificationProps) {
    const { type, title, message, show, onClose, position } = props;

    const handleFlashMessage = () => {
        sessionStorage.removeItem(STORAGE_KEYS.FLASH_MESSAGE);
    };

    return (
        <Snackbar
            anchorOrigin={position}
            open={show}
            onExited={handleFlashMessage}
            autoHideDuration={3000}
            onClose={onClose}
            TransitionComponent={Transition}
        >
            <Alert onClose={onClose} severity={type} variant="filled" elevation={6}>
                {title ? <AlertTitle>{title}</AlertTitle> : null}
                {message}
            </Alert>
        </Snackbar>
    );
}

NotiMessage.defaultProps = {
    onClose: () => console.warn('Undefined onClose'),
    position: { vertical: 'bottom', horizontal: 'right' },
};
