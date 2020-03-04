export const APP_NAME = 'Master Panel';
export const APP_VERSION = '1.5';

const URLS = {
    development: 'http://localhost:8080/',
    production: 'http://api.sundewmyanmar.com:8080/threeinlife-api/',
};
export const API = process.env.NODE_ENV === 'development' ? URLS.development : URLS.production;

export const STORAGE_KEYS = {
    CURRENT_USER: '@com.sdm.CURRENT_USER',
    DEVICE_ID: '@com.sdm.DEVICE_ID',
    MENU: '@com.sdm.MAIN_MENU',
};

export const SUPPORTED_LANGUAGE = [
    { code: 'en', label: 'English' },
    { code: 'mm_uni', label: 'Myanmar_Unicode' },
    { code: 'mm_zg', label: 'Myanmar_Zawgyi' },
    { code: 'cn', label: 'Chinese' },
];

export const FACEBOOK = {
    LOGIN: false,
    APP_ID: '799977977040882',
    API_VERSION: '',
};

export const SUPPORTED_GENDERS = [
    { id: 'm', label: 'Male' },
    { id: 'f', label: 'Female' },
    { id: 'o', label: 'Other' },
];

export const ADMIN_MENU = {
    id: 'admin',
    label: 'Administration',
    icon: 'supervisor_account',
    open: true,
    items: [
        {
            id: 'admin-user',
            label: 'User',
            icon: 'person',
            path: '/user',
        },
        {
            id: 'admin-role',
            label: 'Role',
            icon: 'group',
            path: '/role',
        },
        {
            id: 'admin-menu',
            label: 'System Menu',
            icon: 'link',
            path: '/menu',
        },
        {
            id: 'admin-permission',
            label: 'Route Permission',
            icon: 'router',
            path: '/permission',
        },
    ],
};

export const USER_PROFILE_MENU = {
    id: 'sys-1',
    label: 'System',
    icon: 'settings',
    open: true,
    items: [
        {
            id: 'sys-2',
            label: 'Profile',
            icon: 'face',
            path: '/profile',
        },
        {
            id: 'sys-2',
            label: 'Change Password',
            icon: 'vpn_key',
            path: '/changePassword',
        },
    ],
};

export const DEFAULT_SIDE_MENU = [
    {
        id: 'sys-home',
        label: 'Dashboard',
        icon: 'home',
        path: '/',
        divider: true,
    },
    ADMIN_MENU,
    USER_PROFILE_MENU,
];

export const BATCH_ACTION_MENU = [
    {
        id: 'export_csv',
        label: 'CSV Export',
        icon: 'grid_on',
    },
    {
        id: 'export_json',
        label: 'JSON Export',
        icon: 'code',
    },
    {
        id: 'remove',
        label: 'Remove All',
        icon: 'delete',
    },
];
