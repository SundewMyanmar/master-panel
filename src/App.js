import React, { Component } from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { DefaultTheme } from './config/Theme';
import LoginPage from './page/auth/LoginPage';
import RegisterPage from './page/auth/RegisterPage';
import DashboardPage from './page/DashboardPage';
import ProfilePage from './page/me/ProfilePage';
import ChangePasswordPage from './page/me/ChangePasswordPage';
import UserPage from './page/master/UserPage';
import UserSetupPage from './page/master/UserSetupPage';
import RolePage from './page/master/RolePage';
import RoleSetupPage from './page/master/RoleSetupPage';
import FilePage from './page/master/FilePage';
import FileSetupPage from './page/master/FileSetupPage';
import MenuPage from './page/master/MenuPage';
import MenuSetupPage from './page/master/MenuSetupPage';
import RoutePermissionPage from './page/master/RoutePermissionPage';

import MasterTemplate from './component/MasterTemplate';
import { STORAGE_KEYS } from './config/Constant';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuth: false,
        };
    }

    PrivateRoute = ({ component: Component, ...rest }) => {
        const currentUser = sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER) || '';
        return <Route {...rest} render={props => (currentUser.length > 0 ? <Component {...props} /> : <Redirect to="/login" />)} />;
    };

    render() {
        return (
            <MuiThemeProvider theme={DefaultTheme}>
                <Router>
                    <Switch>
                        <Route path="/login" component={LoginPage} />
                        <Route path="/register" component={RegisterPage} />
                        <MasterTemplate>
                            <this.PrivateRoute exact path="/" component={DashboardPage} />
                            {/* Master Modules */}
                            <this.PrivateRoute exact path="/user/setup" component={UserPage} />
                            <this.PrivateRoute path="/user/setup/detail/:id?" component={UserSetupPage} />
                            <this.PrivateRoute exact path="/profile/" component={ProfilePage} />
                            <this.PrivateRoute exact path="/changePassword/" component={ChangePasswordPage} />

                            <this.PrivateRoute exact path="/role/setup" component={RolePage} />
                            <this.PrivateRoute path="/role/setup/detail/:id?" component={RoleSetupPage} />

                            <this.PrivateRoute exact path="/file/setup" component={FilePage} />
                            <this.PrivateRoute path="/file/setup/detail/:id?" component={FileSetupPage} />

                            {/* Custom Modules */}
                            <this.PrivateRoute exact path="/menu/setup" component={MenuPage} />
                            <this.PrivateRoute path="/menu/setup/detail/:id?" component={MenuSetupPage} />
                            <this.PrivateRoute exact path="/route/setup" component={RoutePermissionPage} />
                        </MasterTemplate>
                    </Switch>
                </Router>
            </MuiThemeProvider>
        );
    }
}

export default App;
