import { createMuiTheme } from '@material-ui/core/styles';

export const common = {
    white: '#fff',
    black: '#616161',
    gray: '#b9c1c5',
    brown: '#5d4037',
    google: '#DC4E41',
    facebook: '#4267B2',
    link: '#738fd6',
    lightGray: '#e9eef1',
};

export const primary = {
    main: '#c00000',
    light: '#fb4c2e',
    dark: '#880000',
    contrastText: '#ffffff',
};

export const darkPrimary = {
    main: '#880000',
    light: '#bf3f2a',
    dark: '#560000',
    contrastText: '#ffffff',
};

export const secondary = {
    main: '#39992f',
    light: '#6ecb5d',
    dark: '#006a00',
    contrastText: '#ffffff',
};

export const darkSecondary = {
    main: '#26861c',
    light: '#5db74b',
    dark: '#005800',
    contrastText: '#ffffff',
};

export const error = {
    main: '#b71c1c',
    light: '#f05545',
    dark: '#7f0000',
    contrastText: '#ffffff',
};

export const warning = {
    main: '#eeb327',
    light: '#ffe55d',
    dark: '#b78400',
    contrastText: '#000000',
};

export const info = {
    main: '#019ac7',
    light: '#5ccbfa',
    dark: '#006c96',
    contrastText: '#000000',
};

export const success = {
    main: '#257d4a',
    light: '#58ad76',
    dark: '#005021',
    contrastText: '#ffffff',
};

export const background = {
    default: '#fbf2f2',
    paper: '#FFFFFF',
};

export const text = {
    primary: '#05162a',
    secondary: primary.dark,
    active: primary.contrastText,
    disabled: 'rgba(0, 0, 0, 0.38)',
    hint: 'rgba(0, 0, 0, 0.38)',
};

export const darkText = {
    primary: '#f1f2f3',
    secondary: darkPrimary.contrastText,
    active: darkPrimary.contrastText,
    disabled: 'rgba(255, 255, 255, 0.38)',
    hint: 'rgba(255, 255, 255, 0.38)',
};

export const action = {
    active: primary.contrastText,
    activeOpactiy: 1,
    hover: primary.light,
    hoverOpacity: 0.42,
    selected: primary.main,
    selectedOpacity: 0.55,
};

export const darkAction = {
    active: darkPrimary.contrastText,
    activeOpactiy: 1,
    hover: darkPrimary.light,
    hoverOpacity: 0.42,
    selected: darkPrimary.main,
    selectedOpacity: 0.55,
};

export const ErrorTheme = createMuiTheme({
    palette: {
        primary: error,
    },
});

export const WarningTheme = createMuiTheme({
    palette: {
        primary: warning,
    },
});

export const InfoTheme = createMuiTheme({
    palette: {
        primary: info,
    },
});

export const SuccessTheme = createMuiTheme({
    palette: {
        primary: success,
    },
});

export const FacebookTheme = createMuiTheme({
    palette: {
        primary: {
            light: '#7694e4',
            main: '#4267B2',
            dark: '#003d82',
            contrastText: '#fff',
        },
    },
});

export default createMuiTheme({
    palette: {
        type: 'light',
        common: common,
        primary: primary,
        error: error,
        warning: warning,
        info: info,
        success: success,
        secondary: secondary,
        background: background,
        text: text,
        divider: '#E0E0E2',
        action: action,
    },
    typography: {
        htmlFontSize: 18,
    },
    overrides: {
        MuiTableRow: {
            root: {
                '&$selected,&$selected:hover': { backgroundColor: primary.light },
            },
        },
        MuiTableCell: {
            root: {
                padding: '0px 4px 0px 4px',
                maxHeight: 30,
                height: 30,
            },
            sizeSmall: {
                padding: '0px 4px 0px 4px',
                maxHeight: 30,
                height: 30,
            },
            sizeMedium: {
                padding: '6px 24px 6px 16px',
                maxHeight: 40,
                height: 40,
            },
        },
    },
});

export const DarkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        common: common,
        primary: darkPrimary,
        error: error,
        warning: warning,
        info: info,
        success: success,
        secondary: darkSecondary,
        // background: background,
        text: darkText,
        // divider: '#E0E0E2',
        action: darkAction,
    },
    typography: {
        htmlFontSize: 18,
    },
    overrides: {
        MuiTableRow: {
            root: {
                '&$selected,&$selected:hover': { backgroundColor: darkPrimary.light },
            },
        },
        MuiTableCell: {
            root: {
                padding: '0px 4px 0px 4px',
                maxHeight: 30,
                height: 30,
            },
            sizeSmall: {
                padding: '0px 4px 0px 4px',
                maxHeight: 30,
                height: 30,
            },
            sizeMedium: {
                padding: '6px 24px 6px 16px',
                maxHeight: 40,
                height: 40,
            },
        },
    },
});
