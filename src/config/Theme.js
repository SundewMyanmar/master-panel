import { createMuiTheme } from '@material-ui/core/styles';

export const common={
    white: '#FFF',
    black: '#000',
    gray: '#648dae',
    red: '#d50000',
    redOnPrimary: '#950000',
    darkRed: '#880e4f',
    green: '#00a152', //'#4caf50',
    blue: '#1976d2', //'#2196f3',
    purple: '#7600b2',
    pink: '#f50057',
    yellow: '#ffee33',
    lime:'#d1ff33',
    teal:'#14a37f',
    cyan:'#00e5ff',
    orange: '#f57c00',
    brown: '#5d4037',
    google: '#DC4E41',
    facebook: '#3b5998',
}

export const action={
    success:"#1b5e20",
    warn:"#b79e0e",
    error:"#640236",
    info:"#006064"
}

export const primary={
    // dark: '#9e3c15',
    dark: '#053509',
    main: '#1b5e20',
    light: '#43a047',
    contrastText: "#e8f5e9",
}

export const secondary={
    dark:'#736808',
    main: '#827717',
    light:'#cddc39',
    contrastText: "#f9fbe7",
}

export const divider='#a4b4ca';

export const background={
    default: '#e8f5e9',
    dark:'#1b5e20',
    light:'#b9f6ca'
}

export const menu={
    main:'#1b5e20',
    //dark:'#3b5998',
    dark:'#053509',
    light:'#a5d6a7'
}

export const text={
    main:'#053509',
    dark:'#011302',
    light:'#c8e6c9'
}

export const DefaultTheme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        type: "light",
        common: common,
        action:action,
        primary: primary,
        secondary: secondary,
        divider: divider,
        background: background,
        menu:menu,
        text:text
    },
});