import Login from '../page/auth/Login';
import Register from '../page/auth/Register';
import ForgetPassword from '../page/auth/ForgetPassword';
import ResetPassword from '../page/auth/ResetPassword';

import Profile from '../page/me/Profile';
import MultiFactorAuthDetail from '../page/me/MultiFactorAuthDetail';
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
import SettingManager from '../page/admin/SettingManager';

//Reporting
import Report from '../page/reporting/Report';
import ReportDetail from '../page/reporting/ReportDetail';

//Inventory
import Product from '../page/inventory/Product';
import ProductDetail from '../page/inventory/ProductDetail';
import Attribute from '../page/inventory/Attribute';
import AttributeDetail from '../page/inventory/AttributeDetail';
import Category from '../page/inventory/Category';
import CategoryDetail from '../page/inventory/CategoryDetail';
import UnitOfMeasurement from '../page/inventory/UnitOfMeasurement';
import UnitOfMeasurementDetail from '../page/inventory/UnitOfMeasurementDetail';

export const PrivateRoute = [
    { path: '/', page: Dashboard },
    { path: '/profile', page: Profile },
    { path: '/mfa/setup', page: MultiFactorAuthDetail },
    { path: '/security', page: Security },
    { path: '/user', page: User },
    { path: '/user/detail/:id', page: UserDetail },
    { path: '/role', page: Role },
    { path: '/role/detail/:id', page: RoleDetail },
    { path: '/menu', page: Menu },
    { path: '/permission/:roleId?', page: ApiPermission },
    { path: '/file', page: File },
    { path: '/report', page: Report },
    { path: '/report/detail/:id', page: ReportDetail },
    { path: '/api-debug', page: Developer },
    { path: '/setting', page: SettingManager },
    /*Inventory */
    { path: '/inventory/product', page: Product },
    { path: '/inventory/product/detail/:id', page: ProductDetail },
    { path: '/inventory/category', page: Category },
    { path: '/inventory/category/detail/:id', page: CategoryDetail },
    { path: '/inventory/uom', page: UnitOfMeasurement },
    { path: '/inventory/uom/detail/:id', page: UnitOfMeasurementDetail },
    { path: '/inventory/attribute', page: Attribute },
    { path: '/inventory/attribute/detail/:id', page: AttributeDetail },
];

export const PublicRoute = [
    {
        path: '/login',
        page: Login,
    },
    {
        path: '/register',
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
