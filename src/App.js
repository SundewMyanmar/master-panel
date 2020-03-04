import React from 'react';
import { ThemeProvider } from '@material-ui/core';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import DefaultTheme from './config/Theme';
import { PublicRoute } from './config/Route';
import Layout from './fragment/layout';

export default function App() {
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
