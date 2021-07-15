import React from 'react';

export const ALERT_REDUX_ACTIONS = {
    SHOW: 'com.sdm.SHOW_GLOBAL_ALERT',
    HIDE: 'com.sdm.HIDE_GLOBAL_ALERT',
    SHOW_LOADING: 'com.sdm.SHOW_GLOBAL_LOADING',
};

const showAlert = (alert) => {
    let message = alert?.message || alert?.code || alert;
    let title = alert?.title || 'INFO';
    return { ...alert, show: true, title: title, message };
};

const DEFAULT_STATE = {
    show: false,
    title: 'Hello',
    message: 'Testing 1 2 3.',
};

export default function (state = DEFAULT_STATE, action) {
    switch (action.type) {
        case ALERT_REDUX_ACTIONS.SHOW:
            return showAlert(action.alert);
        case ALERT_REDUX_ACTIONS.HIDE:
            return { show: false };
        case ALERT_REDUX_ACTIONS.SHOW_LOADING:
            return { show: true, type: 'loading' };
    }
    return state;
}
