import React, { useState } from 'react';
import { withRouter, useHistory, useLocation } from 'react-router-dom';
import MasterTable from '../../fragment/MasterTable';
import UserApi from '../../api/UserApi';
import { AlertDialog, Notification } from '../../fragment/message';
import FormDialog from '../../fragment/message/FormDialog';

const User = props => {
    const location = useLocation();
    const history = useHistory();

    const query = new URLSearchParams(location.search);
    const message = query.get('message');

    const [alert, setAlert] = useState('');
    const [noti, setNoti] = useState(message || '');
    const [resetForm, setResetForm] = useState(null);

    const handleError = error => {
        setAlert(error.message || error.title || 'Please check your internet connection and try again.');
    };

    const handleLoadData = async (currentPage, pageSize, sort, search) => {
        try {
            const result = await UserApi.getPaging(currentPage, pageSize, sort, search);
            return result;
        } catch (error) {
            handleError(error);
        }
    };

    const [struct, setStructure] = React.useState(() => {
        UserApi.getStructure()
            .then(resp => {
                setStructure(resp.data);
            })
            .catch(handleError);
        return [];
    });

    const handleRemoveData = async removeData => {
        if (typeof removeData === 'object') {
            return await UserApi.removeById(removeData.id);
        } else if (Array.isArray(removeData) && removeData.length > 0) {
            const removeIds = removeData.map(item => item.id);
            return await UserApi.removeAll(removeIds);
        }
    };

    const handleDetail = item => {
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
                    .then(response => {
                        setNoti(response.message);
                    })
                    .catch(handleError);
                break;
            default:
                setAlert('Invalid Action!');
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
            .then(response => {
                setNoti('Succesfully changed password for ' + response.displayName);
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

    return (
        <React.Fragment>
            <Notification show={noti.length > 0} onClose={() => setNoti(false)} type="success" message={noti} />
            <AlertDialog onClose={() => setAlert('')} show={alert.length > 0} title="Message" message={alert} />
            <FormDialog
                title={resetPasswordTitle}
                show={resetForm !== null && resetForm.id > 0}
                onClose={() => setResetForm(false)}
                fields={resetPasswordFields}
                onSubmit={handleResetForm}
            />
            <MasterTable
                title="Users"
                structure={struct}
                onLoad={handleLoadData}
                onEdit={handleDetail}
                onAddNew={() => handleDetail(null)}
                onRemove={handleRemoveData}
                onError={handleError}
                onItemAction={handleItemAction}
                moreActions={[
                    {
                        id: 'resetPasword',
                        label: 'Reset Password',
                        icon: 'vpn_key',
                    },
                    {
                        id: 'cleanToken',
                        label: 'Clean Auth Tokens',
                        icon: 'devices',
                    },
                ]}
            />
        </React.Fragment>
    );
};
export default withRouter(User);
