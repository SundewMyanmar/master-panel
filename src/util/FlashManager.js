import React from 'react';
import { STORAGE_KEYS } from '../config/Constant';

export const FLASH_REDUX_ACTIONS = {
    SHOW: 'com.sdm.SHOW_GLOBAL_FLASH_MESSAGE',
    HIDE: 'com.sdm.HIDE_GLOBAL_FLASH_MESSAGE',
};

const DEFAULT_STATE = {
    show: false,
    title: 'Hello',
    message: 'Testing 1 2 3.',
};

export default function (state = DEFAULT_STATE, action) {
    switch (action.type) {
        case FLASH_REDUX_ACTIONS.SHOW:
            return { ...action.flash, show: true };
        case FLASH_REDUX_ACTIONS.HIDE:
            return { show: false };
    }
    return state;
}
