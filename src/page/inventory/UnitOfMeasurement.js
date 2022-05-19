import React from 'react';
import { withRouter, useHistory } from 'react-router';
import MasterTable from '../../fragment/MasterTable';
import UnitOfMeasurementApi from '../../api/UnitOfMeasurementApi';
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
        name: 'code',
        align: 'left',
        label: 'Code/Sign',
        sortable: true,
    },
    {
        name: 'name',
        align: 'left',
        label: 'Name',
        sortable: true,
    },
    {
        name: 'relatedUom',
        align: 'left',
        label: 'Related UOM',
        onLoad: (item) => item.name,
    },
    {
        name: 'relatedValue',
        align: 'right',
        label: 'Relation',
        sortable: true,
    },
    {
        name: 'guild',
        align: 'right',
        label: 'Group',
        sortable: true,
    },
];

const UnitOfMeasurement = () => {
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
            const result = await UnitOfMeasurementApi.getPaging(currentPage, pageSize, sort, search);
            return result;
        } catch (error) {
            handleError(error);
        }
        return {};
    };

    const handleRemoveData = async (removeData) => {
        console.log('Remove IDs => ', typeof removeData === 'object');
        if (removeData && removeData.id) {
            return UnitOfMeasurementApi.removeById(removeData.id);
        } else if (Array.isArray(removeData) && removeData.length > 0) {
            console.log('Remove IDs => ', Array.isArray(removeData) && removeData.length > 0);
            const removeIds = removeData.map((item) => item.id);
            return UnitOfMeasurementApi.removeAll(removeIds);
        }
    };

    const handleDetail = (item) => {
        let url = '/inventory/uom/detail/';
        url += item ? item.id : 0;
        history.push(url);
    };

    const handleImport = async (result) => {
        return UnitOfMeasurementApi.importData(result);
    };

    return (
        <>
            <MasterTable
                title="Unit Of Measurement"
                fields={TABLE_FIELDS}
                importFields={['id', 'code', 'name', 'guild', 'relatedUom', 'relatedValue']}
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

export default withRouter(UnitOfMeasurement);