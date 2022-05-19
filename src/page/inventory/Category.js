import React from 'react';
import { withRouter, useHistory } from 'react-router';
import MasterTable from '../../fragment/MasterTable';
import CategoryApi from '../../api/CategoryApi';
import { ALERT_REDUX_ACTIONS } from '../../util/AlertManager';
import { useDispatch } from 'react-redux';

export const TABLE_FIELDS = [
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
    {
        name: 'parent',
        align: 'left',
        label: 'Parent',
        onLoad: (item) => item.parent ? item.parent.name : '-',
    },
    {
        name: 'icon',
        align: 'left',
        label: 'Icon',
        type: 'icon',
        sortable: true,
    },
];

const Category = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const handleError = (error) => {
        dispatch({
            type: ALERT_REDUX_ACTIONS.SHOW,
            alert: error || 'Please check your internet connection and try again.',
        });
    };

    const handleLoadData = async (currentPage, pageSize, sort, search) => {
        try {
            const result = await CategoryApi.getPaging(currentPage, pageSize, sort, search);
            return result;
        } catch (error) {
            handleError(error);
        }
        return {};
    };

    const handleRemoveData = async (removeData) => {
        console.log('Remove IDs => ', typeof removeData === 'object');
        if (removeData && removeData.id) {
            return CategoryApi.removeById(removeData.id);
        } else if (Array.isArray(removeData) && removeData.length > 0) {
            console.log('Remove IDs => ', Array.isArray(removeData) && removeData.length > 0);
            const removeIds = removeData.map((item) => item.id);
            return CategoryApi.removeAll(removeIds);
        }
    };

    const handleDetail = (item) => {
        let url = '/inventory/category/detail/';
        url += item ? item.id : 0;
        history.push(url);
    };

    const handleImport = async (result) => {
        return CategoryApi.importData(result);
    };

    return (
        <>
            <MasterTable
                title="Categories"
                fields={TABLE_FIELDS}
                importFields={['id', 'name', 'description', 'icon', 'parent']}
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

export default withRouter(Category);