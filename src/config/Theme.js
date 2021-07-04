import { createMuiTheme } from '@material-ui/core/styles';

export const common = {
    white: '#ffffff',
    black: '#343A40',
    gray: '#6C757D',
    brown: '#5d4037',
    google: '#DC4E41',
    facebook: '#4267B2',
    link: '#738fd6',
    lightGray: '#e9eef1',
};

export const primary = {
    main: '#3c4c59',
    light: '#677886',
    dark: '#142430',
    contrastText: '#ffffff',
};

export const darkPrimary = {
    main: '#0D0D0D',
    light: '#343434',
    dark: '#000000',
    contrastText: '#ffffff',
};

export const secondary = {
    main: '#d7cdc3',
    light: '#fffff6',
    dark: '#a69c93',
    contrastText: '#000000',
};

export const darkSecondary = {
    main: '#d7cdc3',
    light: '#fffff6',
    dark: '#a69c93',
    contrastText: '#000000',
};

export const error = {
    main: '#dc3545',
    light: '#ff6b70',
    dark: '#a3001e',
    contrastText: '#ffffff',
};

export const warning = {
    main: '#ffc107',
    light: '#fff350',
    dark: '#c79100',
    contrastText: '#000000',
};

export const info = {
    main: '#17a2b8',
    light: '#60d4ea',
    dark: '#007388',
    contrastText: '#ffffff',
};

export const success = {
    main: '#28a745',
    light: '#64da73',
    dark: '#007717',
    contrastText: '#ffffff',
};

export const background = {
    default: '#F8F9FA',
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
    primary: darkPrimary.contrastText,
    secondary: darkSecondary.contrastText,
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
        secondary: secondary,
        error: error,
        warning: warning,
        info: info,
        success: success,
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
        },
    },
});
