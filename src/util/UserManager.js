import React from 'react';
import { STORAGE_KEYS } from '../config/Constant';

export const USER_REDUX_ACTIONS = {
    LOGIN: 'com.sdm.USER_LOGIN',
    LOGOUT: 'com.sdm.USER_LOGOUT',
    UPDATE: 'com.sdm.UPDATE_USER',
};

const init = () => {
    const userJSON = sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (userJSON && userJSON.length > 0) {
        return JSON.parse(userJSON);
    }
    return false;
};

const login = (authInfo) => {
    if (authInfo.currentToken) {
        sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(authInfo));
    }

    return authInfo;
};

const logout = () => {
    sessionStorage.clear();
    localStorage.removeItem(STORAGE_KEYS.FCM_TOKEN);

    return false;
};

const updateProfile = (authInfo) => {
    sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(authInfo));
    return authInfo;
};

export default function (state = false, action) {
    switch (action.type) {
        case USER_REDUX_ACTIONS.LOGIN:
            return login(action.authInfo);
        case USER_REDUX_ACTIONS.LOGOUT:
            return logout();
        case USER_REDUX_ACTIONS.UPDATE:
            return updateProfile(action.profile);
    }
    return state;
}
