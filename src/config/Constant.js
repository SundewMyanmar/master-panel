export const APP_NAME = 'master-panel';
export const APP_VERSION = '1.5';

const URLS = {
    development: 'http://localhost:8080/',
    production: 'http://localhost:8080/',
};
export const API = process.env.NODE_ENV === 'development' ? URLS.development : URLS.production;

export const SESSION_TIMEOUT = 1000 * 60 * 15; //15 Minutes

export const GOOGLE_API_KEYS = '';

export const STORAGE_KEYS = {
    CURRENT_USER: '@com.sdm.CURRENT_USER',
    DEVICE_ID: '@com.sdm.DEVICE_ID',
    MENU: '@com.sdm.MAIN_MENU',
    TABLE_SESSION: '@com.sdm.TABLE_SESS',
    FLASH_MESSAGE: '@com.sdm.FLASH_MESSAGE',
    THEME: '@com.sdm.THEME',
    FCM_TOKEN: '@com.sdm.FCM_TOKEN',
};

export const VAPID_KEY = '';

export const FCM_CONFIG = {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: '',
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

export const BATCH_IMPORT_MENU = [
    {
        id: 'import_csv',
        label: 'CSV Import',
        icon: 'grid_on',
    },
    {
        id: 'import_json',
        label: 'JSON Import',
        icon: 'code',
    },
];

export const BATCH_ACTION_MENU = [
    {
        id: 'uncheck_all',
        label: 'Uncheck all',
        icon: 'check_box_outline_blank',
    },
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
        color: 'red',
    },
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
            id: 'admin-route',
            label: 'Api Permission',
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
            id: 'profile-1',
            label: 'Profile',
            icon: 'account_circle',
            path: '/profile',
        },
        {
            id: 'profile-2',
            label: 'Security',
            icon: 'security',
            path: '/security',
        },
        process.env.NODE_ENV === 'development'
            ? {
                  id: 'profile-3',
                  label: 'API Tools',
                  icon: 'code',
                  path: '/api-debug',
              }
            : null,
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
    {
        id: 'sys-file',
        label: 'File Manager',
        icon: 'storage',
        path: '/file',
        divider: true,
    },
    USER_PROFILE_MENU,
];

export const GENERAL_STATUS = ['ACTIVE', 'PENDING', 'CANCEL'];
