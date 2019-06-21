import React, { Component } from 'react';
import { 
	HashRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";
import 'typeface-roboto';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { DefaultTheme } from "./config/Theme";
import LoginPage from './page/auth/login';
import DashboardPage from './page/DashboardPage';
import ProfilePage from './page/me/profile';
import ChangePasswordPage from './page/me/changePassword';
import UserPage from './page/master/user';
import UserSetupPage from './page/master/user-setup';
import RolePage from './page/master/role';
import RoleSetupPage from './page/master/role-setup';
import FilePage from './page/master/file';
import FileSetupPage from './page/master/file-setup';
import MenuPage from './page/master/menu';
import MenuSetupPage from './page/master/menu-setup';
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
								<Route path="/login" component={LoginPage} />
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

								</MasterTemplate>
							</Switch>
						
          </Router>
        </MuiThemeProvider>
      );
    }
}

export default App;
