import { createTheme } from '@material-ui/core/styles';

export const common = {
    white: '#ffffff',
    black: '#000000',
    gray: '#5d657b',
    brown: '#5d4037',
    purple: '#9b51e0',
    orange: '#ED683C',
    google: '#DC4E41',
    facebook: '#4267B2',
    link: '#2953A6',
    lightGray: '#c2cbd6',
};

export const primary = {
    main: '#4d748c',
    light: '#a8c3d5',
    dark: '#304c5f',
    contrastText: '#ffffff',
};

export const darkPrimary = {
    main: '#3F4B59',
    light: '#4e5e6f',
    dark: '#2d3641',
    contrastText: '#ffffff',
};

export const secondary = {
    main: '#735C48',
    light: '#9c8d81',
    dark: '#584638',
    contrastText: '#ffffff',
};

export const darkSecondary = {
    main: '#3b2c24',
    light: '#4a392f',
    dark: '#1c1800',
    contrastText: '#ffffff',
};

export const error = {
    main: '#C14549',
    light: '#e35553',
    dark: '#a23939',
    contrastText: '#ffffff',
};

export const warning = {
    main: '#F6C63C',
    light: '#f7d35a',
    dark: '#f4b128',
    contrastText: '#000000',
};

export const info = {
    main: '#0082A8',
    light: '#1393ba',
    dark: '#005175',
    contrastText: '#ffffff',
};

export const success = {
    main: '#038C5A',
    light: '#0c9e67',
    dark: '#015b38',
    contrastText: '#ffffff',
};

export const background = {
    default: '#f4f9fc',
    paper: '#FFFFFF',
};

export const darkBackground = {
    default: '#2A2F35',
    paper: '#2d3641',
};

export const text = {
    primary: '#262d3f',
    secondary: '#262d3f',
    disabled: 'rgba(0, 0, 0, 0.38)',
    hint: 'rgba(0, 0, 0, 0.38)',
};

export const darkText = {
    primary: '#DFEDF2',
    secondary: '#DFEDF2',
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

export const typography = { htmlFontSize: 18 };

export const ErrorTheme = createTheme({
    palette: {
        primary: error,
    },
});

export const WarningTheme = createTheme({
    palette: {
        primary: warning,
    },
});

export const InfoTheme = createTheme({
    palette: {
        primary: info,
    },
});

export const SuccessTheme = createTheme({
    palette: {
        primary: success,
    },
});

export const FacebookTheme = createTheme({
    palette: {
        primary: {
            light: '#7694e4',
            main: '#4267B2',
            dark: '#003d82',
            contrastText: '#fff',
        },
    },
});

export default createTheme({
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
        action: action,
    },
    typography: typography,
    overrides: {
        MuiListItemIcon: {
            root: {
                color: primary.dark,
            },
        },
        MuiListItemText: {
            root: {
                color: primary.dark,
            },
        },
        MuiInputAdornment: {
            root: {
                color: primary.dark,
            },
        },
        MuiIconButton: {
            root: {
                color: primary.main,
            },
            colorPrimary: {
                color: common.white,
            },
        },
        MuiCheckbox: {
            root: {
                color: primary.main,
            },
        },
        MuiAvatar: {
            root: {
                color: common.white,
            },
        },
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
        MuiPickersToolbar: {
            root: {
                backgroundColor: primary.dark,
            },
        },
        MuiPickersDay: {
            root: {
                color: primary.dark,
                '&$disabled': {
                    color: primary.dark,
                },
                '&$selected': {
                    backgroundColor: primary.dark,
                },
            },
            today: {
                color: primary.dark,
            },
        },
        MuiPickersModalDialog: {
            dialogAction: {
                color: primary.dark,
            },
        },
    },
});

export const DarkTheme = createTheme({
    palette: {
        type: 'dark',
        common: common,
        primary: darkPrimary,
        error: error,
        warning: warning,
        info: info,
        success: success,
        secondary: darkSecondary,
        text: darkText,
        action: darkAction,
        background: darkBackground,
    },
    typography: typography,
    overrides: {
        MuiTab: {
            textColorPrimary: {
                '&$selected,&$selected:hover': { color: darkPrimary.contrastText },
            },
            textColorSecondary: {
                '&$selected,&$selected:hover': { color: darkPrimary.contrastText },
            },
        },
        MuiTabs: {
            indicator: {
                backgroundColor: darkPrimary.contrastText,
            },
        },
        MuiListItemIcon: {
            root: {
                color: darkPrimary.contrastText,
            },
        },
        MuiListItemText: {
            root: {
                color: darkPrimary.contrastText,
            },
        },
        MuiInputAdornment: {
            root: {
                color: darkPrimary.contrastText,
            },
        },
        MuiCheckbox: {
            root: {
                color: darkPrimary.contrastText,
            },
        },
        MuiIconButton: {
            root: {
                color: darkPrimary.contrastText,
            },
            label: {
                color: darkPrimary.contrastText,
            },
        },
        MuiAvatar: {
            root: {
                color: darkPrimary.contrastText,
            },
            colorDefault: {
                color: darkPrimary.contrastText,
            },
        },
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
