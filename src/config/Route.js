import Login from '../page/auth/Login';
import Register from '../page/auth/Register';
import ForgetPassword from '../page/auth/ForgetPassword';
import ResetPassword from '../page/auth/ResetPassword';

import Profile from '../page/me/Profile';
import Security from '../page/me/Security';

import Dashboard from '../page/Dashboard';
import User from '../page/admin/User';
import UserDetail from '../page/admin/UserDetail';
import Role from '../page/admin/Role';
import RoleDetail from '../page/admin/RoleDetail';
import Menu from '../page/admin/Menu';
import ApiPermission from '../page/admin/ApiPermission';
import File from '../page/file/File';
import Developer from '../page/Developer';

//Inventory
import Product from '../page/inventory/Product';
import ProductDetail from '../page/inventory/ProductDetail';

export const PrivateRoute = [
    { path: '/', page: Dashboard },
    { path: '/profile', page: Profile },
    { path: '/security', page: Security },
    { path: '/user', page: User },
    { path: '/user/detail/:id', page: UserDetail },
    { path: '/role', page: Role },
    { path: '/role/detail/:id', page: RoleDetail },
    { path: '/menu', page: Menu },
    { path: '/permission/:roleId?', page: ApiPermission },
    { path: '/file', page: File },
    { path: '/api-debug', page: Developer },
    { path: '/inventory/product', page: Product },
    { path: '/inventory/product/detail/:id', page: ProductDetail },
];

export const PublicRoute = [
    {
        path: '/login',
        page: Login,
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
