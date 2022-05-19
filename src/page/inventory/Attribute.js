import React from 'react';
import { withRouter, useHistory } from 'react-router';
import MasterTable from '../../fragment/MasterTable';
import AttributeApi from '../../api/AttributeApi';
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
        name: 'guild',
        align: 'left',
        label: 'Group',
        sortable: true,
    },
    {
        name: 'type',
        align: 'left',
        label: 'Type',
        sortable: true,
    },
    {
        name: 'allowValues',
        align: 'left',
        label: 'Allowed Values',
        sortable: true,
        onLoad: (item) => item.allowValues ? item.allowValues.join(', ') : '-'
    },
    {
        name: 'hasUom',
        align: 'center',
        label: 'Has Uom?',
        type: 'bool',
        sortable: true,
        width: 50,
        onLoad: (item) => item.hasUom,
    },
    {
        name: 'searchable',
        align: 'center',
        label: 'Searchable?',
        type: 'bool',
        sortable: true,
        width: 50,
        onLoad: (item) => item.searchable,
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
            const result = await AttributeApi.getPaging(currentPage, pageSize, sort, search);
            return result;
        } catch (error) {
            handleError(error);
        }
        return {};
    };

    const handleRemoveData = async (removeData) => {
        console.log('Remove IDs => ', typeof removeData === 'object');
        if (removeData && removeData.id) {
            return AttributeApi.removeById(removeData.id);
        } else if (Array.isArray(removeData) && removeData.length > 0) {
            console.log('Remove IDs => ', Array.isArray(removeData) && removeData.length > 0);
            const removeIds = removeData.map((item) => item.id);
            return AttributeApi.removeAll(removeIds);
        }
    };

    const handleDetail = (item) => {
        let url = '/inventory/attribute/detail/';
        url += item ? item.id : 0;
        history.push(url);
    };

    const handleImport = async (result) => {
        return AttributeApi.importData(result);
    };

    return (
        <>
            <MasterTable
                title="Attributes"
                fields={TABLE_FIELDS}
                importFields={['id', 'name', 'description', 'guild', 'type', 'allowValues', 'hasUom', 'searchable']}
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