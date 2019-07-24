import { createMuiTheme } from '@material-ui/core/styles';

export const common={
    white: '#FFF',
    black: '#000',
    gray: '#648dae',
    red: '#d50000',
    redOnPrimary: '#950000',
    darkRed: '#640236',
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
    dark: '#640236',
    main: '#880e4f',
    light: '#f8bbd0',
    contrastText: "#fce4ec",
}

export const secondary={
    dark:'#033d40',
    main: '#006064',
    light:'#00bcd4',
    contrastText: "#e0f7fa",
}

export const divider='#a4b4ca';

export const background={
    default: '#fbebf0',
    dark:'#640236',
    light:'#fce4ec'
}

export const menu={
    main:'#880e4f',
    //dark:'#3b5998',
    dark:'#2d0319',
    light:'#f8bbd0'
}

export const text={
    main:'#880e4f',
    dark:'#730d43',
    light:'#c897b1'
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