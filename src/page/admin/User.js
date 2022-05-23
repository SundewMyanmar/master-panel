import React, { useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import MasterTable from '../../fragment/MasterTable';
import UserApi from '../../api/UserApi';
import FormDialog from '../../fragment/message/FormDialog';
import LangManager from '../../util/LangManager';
import { useTheme } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { ALERT_REDUX_ACTIONS } from '../../util/AlertManager';
import { FLASH_REDUX_ACTIONS } from '../../util/FlashManager';

export const GUILD = 'USER';

export const USER_TABLE_FIELDS = [
    {
        name: 'id',
        align: 'center',
        label: 'ID',
        sortable: true,
    },
    {
        name: 'profileImage',
        align: 'center',
        label: 'Image',
        type: 'image',
    },
    {
        name: 'roles',
        align: 'left',
        label: 'Roles',
        onLoad: (item) => {
            if (item.roles && item.roles.length > 0) {
                return item.roles.map((role) => role.name).join(', ');
            }
            return 'No Role';
        },
    },
    {
        name: 'displayName',
        align: 'left',
        label: 'Name',
        sortable: true,
    },
    {
        name: 'phoneNumber',
        align: 'left',
        label: 'Phone',
        sortable: true,
    },
    {
        name: 'email',
        align: 'left',
        label: 'Email',
        sortable: true,
    },
    {
        name: 'facebookId',
        align: 'center',
        label: 'FB_User',
        type: 'bool',
        sortable: true,
        width: 50,
        onLoad: (item) => item.facebookId,
    },
    {
        name: 'status',
        align: 'center',
        label: 'Status',
        type: 'bool',
        sortable: true,
        width: 50,
        onLoad: (item) => item.status.toLowerCase() === 'active',
    },
];
const User = () => {
    const history = useHistory();
    const theme = useTheme();
    const dispatch = useDispatch();

    const [resetForm, setResetForm] = useState(null);

    const handleError = (error) => {
        dispatch({
            type: ALERT_REDUX_ACTIONS.SHOW,
            alert: error || 'Please check your internet connection and try again.',
        });
    };

    const handleImport = async (result) => {
        return UserApi.importData(result);
    };

    const handleLoadData = async (currentPage, pageSize, sort, search) => {
        try {
            const result = await UserApi.getPaging(currentPage, pageSize, sort, search);
            return result;
        } catch (error) {
            handleError(error);
        }
    };

    const handleRemoveData = async (removeData) => {
        if (typeof removeData === 'object') {
            return await UserApi.removeById(removeData.id);
        } else if (Array.isArray(removeData) && removeData.length > 0) {
            const removeIds = removeData.map((item) => item.id);
            return await UserApi.removeAll(removeIds);
        }
    };

    const handleDetail = (item) => {
        let url = '/user/detail/';
        url += item ? item.id : 0;
        history.push(url);
    };

    const handleItemAction = (item, data) => {
        switch (item.id) {
            case 'resetPasword':
                setResetForm(data);
                break;
            case 'cleanToken':
                UserApi.cleanToken(data.id)
                    .then((response) => {
                        dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
                        dispatch({
                            type: FLASH_REDUX_ACTIONS.SHOW,
                            flash: { type: 'success', message: response.message },
                        });
                    })
                    .catch(handleError);
                break;
            default:
                handleError('Invalid Action!');
                break;
        }
    };

    const handleResetForm = (event, form) => {
        const data = {
            newPassword: form.newPassword,
            oldPassword: form.adminPassword,
            user: resetForm.email || resetForm.phoneNumber,
        };

        UserApi.resetPassword(resetForm.id, data)
            .then((response) => {
                dispatch({
                    type: FLASH_REDUX_ACTIONS.SHOW,
                    flash: { type: 'success', message: 'Succesfully changed password for ' + response.displayName },
                });
                setResetForm(null);
            })
            .catch(handleError);
    };

    const resetPasswordFields = [
        {
            id: 'adminPassword',
            label: 'Admin Password',
            required: true,
            type: 'password',
            autoFocus: true,
        },
        {
            id: 'newPassword',
            label: 'New Password',
            required: true,
            type: 'password',
        },
        {
            id: 'confirmPassword',
            label: 'Confirm Password',
            required: true,
            type: 'password',
            onValidate: (event, form) => (form.newPassword !== event.target.value ? "Password and Confirm Password doesn't match." : ''),
        },
    ];

    const resetPasswordTitle = resetForm ? 'Reset password for ' + resetForm.displayName : 'Reset password for Htoonlin';

    const gridFields = USER_TABLE_FIELDS.map((f) => f.name);

    return (
        <React.Fragment>
            <FormDialog
                title={resetPasswordTitle}
                show={resetForm !== null && resetForm.id > 0}
                onClose={() => setResetForm(false)}
                fields={resetPasswordFields}
                onSubmit={handleResetForm}
            />
            <MasterTable
                title="Users"
                fields={USER_TABLE_FIELDS}
                importFields={[...gridFields, 'extras', 'password']}
                onLoad={handleLoadData}
                onEdit={handleDetail}
                onAddNew={() => handleDetail(null)}
                onRemove={handleRemoveData}
                onError={handleError}
                onImport={handleImport}
                onItemAction={handleItemAction}
                moreActions={[
                    {
                        id: 'resetPasword',
                        label: 'Reset Password',
                        icon: 'vpn_key',
                        color: theme.palette.warning.main,
                    },
                    {
                        id: 'cleanToken',
                        label: 'Clean Auth Tokens',
                        icon: 'devices',
                        color: theme.palette.info.main,
                    },
                ]}
            />
        </React.Fragment>
    );
};
export default withRouter(User);
