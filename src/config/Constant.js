import { error } from './Theme';

export const APP_NAME = 'master-panel';
export const APP_VERSION = '1.7';

const URLS = {
    development: 'http://localhost:8080/',
    production: 'https://api.threeinlife.com/master-api/',
};

export const UOM = ['Length', 'Volume', 'Weight'];
export const ATTRIBUTE = ['Product', 'Design', 'Configuration', 'Display', 'Location'];
export const STATUS = ['AVAILABLE', 'UNAVAILABLE', 'OUT_OF_STOCK'];
export const BARCODE_TYPES = ['UPC', 'EAN', 'CODE_39', 'CODE_128'];
export const API = process.env.NODE_ENV === 'development' ? URLS.development : URLS.production;

export const SESSION_TIMEOUT = 1000 * 60 * 20; //20 Minutes

export const GOOGLE_API_KEYS = '';

export const GOOGLE_AUTH_OPTIONS = {
    scopes: ['email'],
    webClientId: '332664396318-vef0mc89a6pk1cuiq6m2qj0j8r7f0evf.apps.googleusercontent.com',
};

export const TINY_EDITOR_API_KEY = 'vwm860x0xtl1z0q99yy3bqhv79eawa40fx4h2ewwob23seb8';

export const STORAGE_KEYS = {
    CURRENT_USER: '@com.sdm.CURRENT_USER',
    DEVICE_ID: '@com.sdm.DEVICE_ID',
    MENU: '@com.sdm.MAIN_MENU',
    TABLE_SESSION: '@com.sdm.TABLE_SESS',
    THEME: '@com.sdm.THEME',
    FCM_TOKEN: '@com.sdm.FCM_TOKEN',
};

export const VAPID_KEY = '';

export const FCM_CONFIG = null;
// export const FCM_CONFIG = {
//     apiKey: '',
//     authDomain: '',
//     databaseURL: '',
//     projectId: '',
//     storageBucket: '',
//     messagingSenderId: '',
//     appId: '',
//     measurementId: '',
// };

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
        color: error.main,
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
        {
            id: 'admin-setting',
            label: 'Settings',
            icon: 'settings',
            path: '/setting',
        },
        {
            id: 'sys-file',
            label: 'File Manager',
            icon: 'storage',
            path: '/file',
            divider: true,
        },
    ],
};

export const DEVELOPER_MENU = {
    id: 'developer',
    label: 'Developer',
    icon: 'code',
    items: [
        {
            id: 'sys-report',
            label: 'Report Manager',
            icon: 'bar_chart',
            path: '/report',
            divider: true,
        },
        process.env.NODE_ENV === 'development'
            ? {
                  id: 'profile-3',
                  label: 'API Tools',
                  icon: 'api',
                  path: '/api-debug',
              }
            : null,
    ],
};

export const INVENTORY_MENU = {
    id: 'ivt-1',
    label: 'Inventory',
    icon: 'store',
    open: true,
    items: [
        {
            id: 'pro-1',
            label: 'Product',
            icon: 'widgets',
            path: '/inventory/product',
        },
        {
            id: 'cat-1',
            label: 'Product Category',
            icon: 'toc',
            path: '/inventory/category',
        },
        {
            id: 'uom-1',
            label: 'Unit Of Measurement',
            icon: 'perm_data_setting',
            path: '/inventory/uom',
        },
        {
            id: 'att-1',
            label: 'Attribute',
            icon: 'settings_applications',
            path: '/inventory/attribute',
        },
    ],
};

export const USER_PROFILE_MENU = {
    id: 'me',
    label: 'Me',
    icon: 'face',
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
    INVENTORY_MENU,
    ADMIN_MENU,
    DEVELOPER_MENU,
    USER_PROFILE_MENU,
];

export const GENERAL_STATUS = ['ACTIVE', 'PENDING', 'CANCEL'];
