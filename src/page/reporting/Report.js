import React from 'react';
import { withRouter, useHistory } from 'react-router';
import MasterTable from '../../fragment/MasterTable';
import ReportApi from '../../api/ReportApi';
import { ALERT_REDUX_ACTIONS } from '../../util/AlertManager';
import { useDispatch } from 'react-redux';

export const REPORT_TABLE_FIELDS = [
    {
        name: 'name',
        align: 'left',
        label: 'Name',
        sortable: true,
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
        name: 'public',
        align: 'center',
        label: 'Is public?',
        sortable: true,
        type: 'bool',
    },
];

const Report = () => {
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
            const result = await ReportApi.getPaging(currentPage, pageSize, sort, search);
            return result;
        } catch (error) {
            handleError(error);
        }
        return {};
    };

    const handleRemoveData = async (removeData) => {
        console.log('Remove IDs => ', typeof removeData === 'object');
        if (removeData && removeData.id) {
            return ReportApi.removeById(removeData.id);
        } else if (Array.isArray(removeData) && removeData.length > 0) {
            console.log('Remove IDs => ', Array.isArray(removeData) && removeData.length > 0);
            const removeIds = removeData.map((item) => item.id);
            return ReportApi.removeAll(removeIds);
        }
    };

    const handleDetail = (item) => {
        let url = '/report/detail/';
        url += item ? item.id : 0;
        history.push(url);
    };

    const handleImport = async (result) => {
        return ReportApi.importData(result);
    };

    return (
        <>
            <MasterTable
                title="Reports"
                fields={REPORT_TABLE_FIELDS}
                importFields={['id', 'name', 'roles', 'isPublic']}
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

export default withRouter(Report);
