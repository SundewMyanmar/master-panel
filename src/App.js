import React, { Component } from 'react';
import logo from './res/logo.png';
import { 
	HashRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";
import 'typeface-roboto';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { DefaultTheme } from "./config/Theme";
import Login from './page/auth/LoginPage';
import DashboardPage from './page/DashboardPage';
import ProfilePage from './page/me/profile';
import ChangePasswordPage from './page/me/changePassword';
import UserPage from './page/master/user';
import UserSetupPage from './page/master/user-setup';
import MasterTemplate from './component/MasterTemplate';
import { STORAGE_KEYS } from './config/Constant';

class App extends Component {
  constructor(props){
		super(props);
		this.state = {
			isAuth: false,
		}
  }
  
  PrivateRoute = ({ component: Component, ...rest }) => {
		const currentUser = sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER) || '';
		return (
		  <Route
				{...rest}
				render={props =>
					currentUser.length > 0 ? (
					<Component {...props} />
					) : (
					<Redirect
						to="/login"
					/>
					)
				}
		  />
			);
	  }

    render() {
      return (
        <MuiThemeProvider theme={DefaultTheme}>
          <Router>
						
							<Switch>
								<Route path="/login" component={Login} />
								<MasterTemplate>
								<this.PrivateRoute exact path="/" component={DashboardPage} />
								{/**Master Modules*/}
								<this.PrivateRoute exact path="/user/setup" component={UserPage} />
								<this.PrivateRoute path="/user/setup/detail/:id?" component={UserSetupPage} />
								<this.PrivateRoute exact path="/profile/" component={ProfilePage} />
								<this.PrivateRoute exact path="/changePassword/" component={ChangePasswordPage} />
								</MasterTemplate>
							</Switch>
						
          </Router>
        </MuiThemeProvider>
      );
    }
}

export default App;
