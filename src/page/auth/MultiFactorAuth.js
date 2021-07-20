import React, { useEffect, useState } from 'react';
import { withRouter, useHistory } from 'react-router';
import MasterTable from '../../fragment/MasterTable';
import MfaApi from '../../api/MfaApi';
import { STORAGE_KEYS } from '../../config/Constant';
import { ALERT_REDUX_ACTIONS } from '../../util/AlertManager';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Icon, IconButton, ThemeProvider, Tooltip } from '@material-ui/core';
import DataTable from '../../fragment/table';
import OTPDialog from '../../fragment/control/OTPDialog';
import { ErrorTheme } from '../../config/Theme';

export const MFA_TABLE_FIELDS = [
    {
        name: 'type',
        label: 'MFA Type',
        sortable: true,
    },
    {
        name: 'key',
        label: 'Key',
        sortable: true,
    },
    {
        name: 'main',
        align: 'center',
        label: 'Default MFA',
        type: 'bool',
        sortable: true,
        width: 50,
    },
    {
        name: 'verify',
        align: 'center',
        label: 'Verified?',
        type: 'bool',
        sortable: true,
        width: 50,
    },
];

export default function MultiFactorAuth(props) {
    const history = useHistory();
    const dispatch = useDispatch();

    const [paging, setPaging] = useState({
        total: 0,
        pageSize: 10,
        currentPage: 0,
        sort: 'modifiedAt:DESC',
    });
    const [currentMfa, setCurrentMfa] = useState(null);
    const [showOtp, setShowOtp] = useState(false);

    const handleError = (error) => {
        dispatch({
            type: ALERT_REDUX_ACTIONS.SHOW,
            alert: error || 'Please check your internet connection and try again.',
        });
    };

    const handleLoadData = async (currentPage = 0, pageSize = 10, sort = 'modifiedAt:DESC') => {
        try {
            const result = await MfaApi.getPaging(currentPage, pageSize, sort, '');
            setPaging(result);
        } catch (error) {
            handleError(error);
        }
        return {};
    };

    useEffect(() => {
        handleLoadData();

        // eslint-disable-next-line
    }, []);

    const handleEdit = (item) => {
        setCurrentMfa(item);
        if (item.type !== 'APP') {
            MfaApi.resend(props.userId, item.key)
                .then(() => {
                    setShowOtp(true);
                })
                .catch(handleError);
        } else {
            setShowOtp(true);
        }
    };

    const handleRemoveData = async (removeData) => {
        console.log('Remove IDs => ', removeData);
        // if (removeData && removeData.id) {
        //     return RoleApi.removeById(removeData.id);
        // } else if (Array.isArray(removeData) && removeData.length > 0) {
        //     console.log('Remove IDs => ', Array.isArray(removeData) && removeData.length > 0);
        //     const removeIds = removeData.map((item) => item.id);
        //     return RoleApi.removeAll(removeIds);
        // }
    };

    const handleOtpSubmit = (code) => {
        dispatch({ type: ALERT_REDUX_ACTIONS.SHOW_LOADING });

        if (!code) {
            handleError('Please fill code.');
            return;
        }

        setShowOtp(false);
        MfaApi.verify(code, mfa.type === 'APP' ? null : mfa.key)
            .then((result) => {
                dispatch({
                    type: FLASH_REDUX_ACTIONS.SHOW,
                    flash: { type: 'success', message: '2-step verification setup is success! Please log in again.' },
                });
                dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
                handleLoadData();
            })
            .catch(handleError);
    };

    const fields_with_action = [
        ...MFA_TABLE_FIELDS,
        {
            name: 'mfa_remove',
            align: 'center',
            label: '@',
            minWidth: 50,
            type: 'raw',
            onLoad: (item) => (
                <>
                    <ThemeProvider theme={ErrorTheme}>
                        <IconButton size="small" onClick={() => console.log('Remove Item => ', item)}>
                            <Icon color="primary">delete</Icon>
                        </IconButton>
                    </ThemeProvider>
                </>
            ),
        },
    ];

    return (
        <>
            <OTPDialog
                userId={props.userId}
                mfaKey={currentMfa?.type === 'APP' ? null : currentMfa?.key}
                show={showOtp}
                onClose={() => setShowOtp(false)}
                onSubmit={handleOtpSubmit}
            />
            <DataTable
                multi={false}
                fields={fields_with_action}
                items={paging.data}
                total={paging.total}
                pageSize={paging.pageSize}
                currentPage={paging.currentPage}
                sort={paging.sort}
                onPageChange={(page) => handleLoadData(page.page, page.pageSize, page.sort)}
                onEdit={handleEdit}
            />
        </>
    );
}
