import React from 'react';
import { withRouter, useHistory } from 'react-router';
import MasterTable from '../../fragment/MasterTable';
import { AlertDialog, Notification } from '../../fragment/message';
import RoleApi from '../../api/RoleApi';
import { STORAGE_KEYS } from '../../config/Constant';

export const ROLE_TABLE_FIELDS = [
    {
        name: 'id',
        align: 'center',
        label: 'Id',
        sortable: true,
    },
    {
        name: 'name',
        align: 'left',
        label: 'Name',
        sortable: true,
    },
    {
        name: 'description',
        align: 'left',
        label: 'Description',
        sortable: true,
    },
];

const Role = props => {
    const history = useHistory();

    const [error, setError] = React.useState('');
    const [noti, setNoti] = React.useState(() => {
        const flashMessage = sessionStorage.getItem(STORAGE_KEYS.FLASH_MESSAGE);
        return flashMessage || '';
    });

    const handleError = error => {
        setError(error.message || error.title || 'Please check your internet connection and try again.');
    };

    const handleLoadData = async (currentPage, pageSize, sort, search) => {
        try {
            const result = await RoleApi.getPaging(currentPage, pageSize, sort, search);
            return result;
        } catch (error) {
            handleError(error);
        }
        return {};
    };

    const handleRemoveData = async removeData => {
        console.log('Remove IDs => ', typeof removeData === 'object');
        if (removeData && removeData.id) {
            return RoleApi.removeById(removeData.id);
        } else if (Array.isArray(removeData) && removeData.length > 0) {
            console.log('Remove IDs => ', Array.isArray(removeData) && removeData.length > 0);
            const removeIds = removeData.map(item => item.id);
            return RoleApi.removeAll(removeIds);
        }
    };

    const handleDetail = item => {
        let url = '/role/detail/';
        url += item ? item.id : 0;
        history.push(url);
    };

    const handleImport = async result => {
        return RoleApi.importData(result);
    };

    return (
        <>
            <Notification show={noti.length > 0} onClose={() => setNoti(false)} type="success" message={noti} />
            <AlertDialog onClose={() => setError('')} show={error.length > 0} title="Error" message={error} />
            <MasterTable
                title="Roles"
                fields={ROLE_TABLE_FIELDS}
                importFields={['id', 'name', 'description']}
                onLoad={handleLoadData}
                onEdit={handleDetail}
                onAddNew={() => handleDetail(null)}
                onRemove={handleRemoveData}
                onImport={handleImport}
                onError={handleError}
            />
        </>
    );
};

export default withRouter(Role);
