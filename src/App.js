import React from 'react';
import { ThemeProvider } from '@material-ui/core';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import DefaultTheme from './config/Theme';
import { PublicRoute } from './config/Route';
import Layout from './fragment/layout';
import ApiManager from './util/ApiManager';

const api = new ApiManager('/');
const checkConnection = async () => {
    console.log('Check Connection!');
    const response = await api.get('/', api.getHeaders(false));
    console.log(response);
};

export default function App() {
    //check XSRF
    checkConnection();

    return (
        <ThemeProvider theme={DefaultTheme}>
            <Router>
                <Switch>
                    {PublicRoute.map((route, index) => (
                        <Route exact key={index} path={route.path} component={route.page} />
                    ))}
                    <Layout />
                </Switch>
            </Router>
        </ThemeProvider>
    );
}
