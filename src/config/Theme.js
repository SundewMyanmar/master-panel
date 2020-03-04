import { createMuiTheme } from '@material-ui/core/styles';

export const common = {
    white: '#FFF',
    black: '#09090B',
    gray: '#b9c1c5',
    brown: '#5d4037',
    google: '#DC4E41',
    facebook: '#4267B2',
};

export const primary = {
    main: '#38486b', //'#4c5059',
    light: '#94a1ca',
    dark: '#0a2140',
    contrastText: '#fff',
};

export const secondary = {
    main: '#008F78', //'#d9c6b0',
    light: '#4fc0a7',
    dark: '#00614c',
    contrastText: '#fff',
};

export const error = {
    main: '#e04646',
    light: '#ff7972',
    dark: '#a8001e',
    contrastText: '#fff',
};

export const warning = {
    main: '#ffb630',
    light: '#ffe864',
    dark: '#c78600',
    contrastText: '#fff',
};

export const info = {
    main: '#019ac7',
    light: '#5ccbfa',
    dark: '#006c96',
    contrastText: '#fff',
};

export const success = {
    main: '#3ea725',
    light: '#74d957',
    dark: '#007700',
    contrastText: '#fff',
};

export const background = {
    default: '#ebedf2',
    paper: '#ffffff',
};

export const text = {
    primary: '#0D0D0D',
    secondary: primary.dark,
    active: primary.contrastText,
    disabled: 'rgba(0, 0, 0, 0.38)',
    hint: 'rgba(0, 0, 0, 0.38)',
};

export const action = {
    active: primary.contrastText,
    activeOpactiy: 1,
    hover: primary.light,
    hoverOpacity: 0.42,
    selected: primary.main,
    selectedOpacity: 0.55,
};

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
});
