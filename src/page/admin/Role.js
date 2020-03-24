import React from 'react';
import { withRouter, useHistory, useLocation } from 'react-router';
import MasterTable from '../../fragment/MasterTable';
import { AlertDialog, Notification, LoadingDialog } from '../../fragment/message';
import RoleApi from '../../api/RoleApi';

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
    const location = useLocation();
    const history = useHistory();

    const query = new URLSearchParams(location.search);
    const message = query.get('message');

    const [error, setError] = React.useState('');
    const [noti, setNoti] = React.useState(message || '');
    const [loading, setLoading] = React.useState(false);

    const handleError = error => {
        setError(error.message || error.title || 'Please check your internet connection and try again.');
        setLoading(false);
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

    const [struct, setStructure] = React.useState(() => {
        RoleApi.getStructure()
            .then(resp => {
                if (resp.count > 0) {
                    setStructure(resp.data);
                }
            })
            .catch(handleError);
        return [];
    });

    const handleRemoveData = async removeData => {
        console.log('Remove IDs => ', typeof removeData === 'object');
        if (removeData && removeData.id) {
            return await RoleApi.removeById(removeData.id);
        } else if (Array.isArray(removeData) && removeData.length > 0) {
            console.log('Remove IDs => ', Array.isArray(removeData) && removeData.length > 0);
            const removeIds = removeData.map(item => item.id);
            return await RoleApi.removeAll(removeIds);
        }
    };

    const handleDetail = item => {
        let url = '/role/detail/';
        url += item ? item.id : 0;
        history.push(url);
    };

    const handleImport = result => {
        console.log('import => ', result);
        setLoading(true);
        RoleApi.importData(result.data)
            .then(resp => {
                console.log(resp);
                setLoading(false);
            })
            .catch(handleError);
    };

    return (
        <>
            <Notification show={noti.length > 0} onClose={() => setNoti(false)} type="success" message={noti} />
            <AlertDialog onClose={() => setError('')} show={error.length > 0} title="Error" message={error} />
            <LoadingDialog show={loading} />
            <MasterTable
                title="Roles"
                structure={struct}
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
