import { createMuiTheme } from '@material-ui/core/styles';

export const common={
    white: '#FFF',
    black: '#000',
    gray: '#648dae',
    red: '#d50000',
    redOnPrimary: '#950000',
    darkRed: '#801313',
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
    success:"#00765F",
    warn:"#E0B139",
    error:"#99445D",
    info:"#2774ae"
}

export const primary={
    dark: '#0077b5',
    main: '#3b5998',
    light: '#55acee',
    contrastText: "#f6f7fa",
}

export const secondary={
    dark:'#dd4b39',
    main: '#bd081c',
    light:'#dd4b39',
    contrastText: "#f8dedb",
}

export const divider='#a4b4ca';

export const background={
    default: '#f2f2f2',
    dark:'#a4b4ca',
    light:'#e1e8f2'
}

export const menu={
    main:'#a4b4ca',
    //dark:'#3b5998',
    dark:'#98aecc',
    light:'#f6f7fa'
}

export const text={
    main:'#01426a',
    dark:'#656565',
    light:'#f5f5f5'
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