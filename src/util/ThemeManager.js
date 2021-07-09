import React from 'react';
import { STORAGE_KEYS } from '../config/Constant';

export const THEME_REDUX_ACTIONS = {
    CHANGE_MODE: 'com.sdm.CHANGE_MODE',
};

const DEFAULT_STATE = {
    mode: 'LIGHT',
};

const changeMode = (currentState) => {
    let newMode = currentState.mode === 'DARK' ? 'LIGHT' : 'DARK';
    localStorage.setItem(STORAGE_KEYS.THEME, newMode);
    return {
        mode: newMode,
    };
};

export default function (state = DEFAULT_STATE, action) {
    switch (action.type) {
        case THEME_REDUX_ACTIONS.CHANGE_MODE:
            return changeMode(state);
    }

    return state;
}
