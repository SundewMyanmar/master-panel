import { createMuiTheme } from '@material-ui/core/styles';

export const common = {
    white: '#FFF',
    black: '#000',
    gray: '#b9c1c5',
    red: '#d50000',
    redOnPrimary: '#950000',
    darkRed: '#880e4f',
    green: '#4caf50', //'#4caf50',
    blue: '#2196f3', //'#2196f3',
    purple: '#7600b2',
    pink: '#f50057',
    yellow: '#ffee33',
    lime: '#d1ff33',
    teal: '#14a37f',
    cyan: '#00e5ff',
    orange: '#f57c00',
    brown: '#5d4037',
    google: '#DC4E41',
    facebook: '#3b5998',
    marked: '#d6dee2',
};

export const action = {
    success: '#1b5e20',
    warn: '#b79e0e',
    error: '#640236',
    info: '#006064',
};

export const primary = {
    dark: '#2f4484',
    main: '#606fb4',
    light: '#919de6',
    contrastText: '#f1f1f1',
};

export const secondary = {
    dark: '#8c367a',
    main: '#be65a9',
    light: '#f295db',
    contrastText: '#f1f1f1',
};

export const divider = primary.main;

export const background = {
    default: '#f1f1f1',
    dark: '#606fb4',
    light: '#c4ccfb',
};

export const menu = {
    main: '#1b5e20',
    dark: '#053509',
    light: '#a5d6a7',
};

export const text = {
    main: '#606fb4',
    dark: '#2f4484',
    light: '#919de6',
};

export const DefaultTheme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        type: 'light',
        common: common,
        action: action,
        primary: primary,
        secondary: secondary,
        divider: divider,
        background: background,
        menu: menu,
        text: text,
    },
});
