import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import DefaultTheme, { DarkTheme } from './config/Theme';
import { PublicRoute } from './config/Route';
import Layout from './fragment/layout';
import ApiManager from './util/ApiManager';
import { STORAGE_KEYS } from './config/Constant';
import { combineReducers, createStore } from 'redux';
import UserManager, { USER_REDUX_ACTIONS } from './util/UserManager';
import ThemeManager from './util/ThemeManager';
import AlertManager from './util/AlertManager';
import Alert from './fragment/message/Alert';
import { Provider, useSelector } from 'react-redux';
import { FlashMessage } from './fragment/message';
import FlashManager from './util/FlashManager';

const api = new ApiManager('/');
const checkConnection = async () => {
    console.log('Check Connection!');
    const response = await api.get('/', api.getHeaders(false));
    console.log(response);
};

const rootReducer = combineReducers({
    alert: AlertManager,
    flash: FlashManager,
    user: UserManager,
});

export default function App() {
    //check XSRF
    checkConnection();

    //Load Current User
    let initStore = { user: false };
    const userJSON = sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (userJSON && userJSON.length > 0) {
        initStore.user = JSON.parse(userJSON);
    }
    const reduxStore = createStore(rootReducer, initStore);

    const [mode, setMode] = useState(() => {
        return localStorage.getItem(STORAGE_KEYS.THEME);
    });

    const toggleMode = (newMode) => {
        console.log('new mode', newMode);
        localStorage.setItem(STORAGE_KEYS.THEME, newMode);
        setMode(newMode);
    };

    return (
        <Provider store={reduxStore}>
            <ThemeProvider theme={mode === 'DARK' ? DarkTheme : DefaultTheme}>
                <Alert />
                <FlashMessage />
                <Router>
                    <Switch>
                        {PublicRoute.map((route, index) => (
                            <Route exact key={index} path={route.path} component={route.page} />
                        ))}
                        {<Layout mode={mode} onToggleMode={toggleMode} />}
                    </Switch>
                </Router>
            </ThemeProvider>
        </Provider>
    );
}
