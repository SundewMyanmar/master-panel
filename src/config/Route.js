import Login from '../page/auth/Login';
import Register from '../page/auth/Register';
import ForgetPassword from '../page/auth/ForgetPassword';
import ResetPassword from '../page/auth/ResetPassword';

import Profile from '../page/me/Profile';
import ChangePassword from '../page/me/ChangePassword';

import Dashboard from '../page/Dashboard';
import User from '../page/admin/User';
import UserDetail from '../page/admin/UserDetail';
import Role from '../page/admin/Role';
import RoleDetail from '../page/admin/RoleDetail';
import Menu from '../page/admin/Menu';
import MenuDetail from '../page/admin/MenuDetail';
import Permission from '../page/admin/Permission';

export const PrivateRoute = [
    { path: '/', page: Dashboard },
    { path: '/profile', page: Profile },
    { path: '/changePassword', page: ChangePassword },
    { path: '/user', page: User },
    { path: '/user/detail/:id', page: UserDetail },
    { path: '/role', page: Role },
    { path: '/role/detail/:id', page: RoleDetail },
    { path: '/menu', page: Menu },
    { path: '/menu/detail/:id', page: MenuDetail },
    { path: '/permission', page: Permission },
];

export const PublicRoute = [
    {
        path: '/login',
        page: Login,
    },
    {
        path: '/auth/register',
        page: Register,
    },
    {
        path: '/auth/forgetPassword',
        page: ForgetPassword,
    },
    {
        path: '/auth/resetPassword',
        page: ResetPassword,
    },
];

export default {
    private: PrivateRoute,
    public: PublicRoute,
};
