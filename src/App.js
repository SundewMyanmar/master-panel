import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import DefaultTheme, { DarkTheme } from './config/Theme';
import { PublicRoute } from './config/Route';
import Layout from './fragment/layout';
import ApiManager from './util/ApiManager';
import { STORAGE_KEYS } from './config/Constant';

const api = new ApiManager('/');
const checkConnection = async () => {
    console.log('Check Connection!');
    const response = await api.get('/', api.getHeaders(false));
    console.log(response);
};

export default function App() {
    //check XSRF
    checkConnection();

    const [mode, setMode] = useState(() => {
        return localStorage.getItem(STORAGE_KEYS.THEME);
    });

    const toggleMode = (newMode) => {
        console.log('new mode', newMode);
        localStorage.setItem(STORAGE_KEYS.THEME, newMode);
        setMode(newMode);
    };

    return (
        <ThemeProvider theme={mode === 'DARK' ? DarkTheme : DefaultTheme}>
            <Router>
                <Switch>
                    {PublicRoute.map((route, index) => (
                        <Route exact key={index} path={route.path} component={route.page} />
                    ))}
                    {<Layout mode={mode} onToggleMode={toggleMode} />}
                </Switch>
            </Router>
        </ThemeProvider>
    );
}
