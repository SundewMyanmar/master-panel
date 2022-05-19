import React from 'react';
import { withRouter, useHistory, useLocation } from 'react-router';
import MasterTable from '../../fragment/MasterTable';
import ProductApi from '../../api/ProductApi';
import { STORAGE_KEYS } from '../../config/Constant';
import FormatManager from '../../util/FormatManager';
import { useDispatch } from 'react-redux';
import { ALERT_REDUX_ACTIONS } from '../../util/AlertManager';

export const PRODUCT_TABLE_FIELDS = [
    {
        name: 'id',
        align: 'center',
        label: 'Id',
        sortable: true,
    },
    {
        name: 'attachments',
        align: 'center',
        label: 'Image',
        type: 'image',
        onLoad: (item) =>
            item.attachments && item.attachments.length > 0 && item.attachments[0].file
                ? item.attachments[0].file.urls.private || item.attachments[0].file.urls.public
                : null,
    },
    {
        name: 'code',
        align: 'left',
        label: 'Code',
        sortable: true,
    },
    {
        name: 'name',
        align: 'left',
        label: 'Name',
        sortable: true,
    },
    {
        name: 'tags',
        align: 'left',
        label: 'Tags',
        sortable: true,
        onLoad: (item) => item.tags ? item.tags.join(',') : ''
    },
    {
        name: 'categories',
        align: 'left',
        label: 'Categories',
        sortable: true,
        onLoad: (item) => (item.categories ? item.categories.map(i => i.name).join(', ') : ''),
    },
    {
        name: 'currentRetailSale',
        align: 'right',
        label: 'Retail Sale',
        sortable: false,
        onLoad: (item) => {
            let value = 0;
            if (item.productPricings && item.productPricings.length > 0) {
                for (let i = 0; i < item.productPricings.length; i++) {
                    if (item.productPricings[i].customerType === 'RETAIL_SALE') value = item.productPricings[i].pricePerUnit;
                }
            }

            return FormatManager.thousandSeparator(value);
        },
    },
    {
        name: 'currentWholeSale',
        align: 'right',
        label: 'Whole Sale',
        sortable: false,
        onLoad: (item) => {
            let value = 0;
            if (item.productPricings && item.productPricings.length > 0) {
                for (let i = 0; i < item.productPricings.length; i++) {
                    if (item.productPricings[i].customerType === 'WHOLE_SALE') value = item.productPricings[i].pricePerUnit;
                }
            }

            return FormatManager.thousandSeparator(value);
        },
    },
    {
        name: 'isBestSelling',
        align: 'center',
        label: 'Best Selling',
        type: 'bool',
        sortable: true,
        width: 30,
        onLoad: (item) => item.isBestSelling,
    },
    {
        name: 'status',
        align: 'center',
        label: 'Status',
        sortable: true,
        width: 30,
        onLoad: (item) => item.status,
    },
];

const Product = (props) => {
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();

    const handleError = (error) => {
        dispatch({
            type: ALERT_REDUX_ACTIONS.SHOW,
            alert: error || 'Please check your internet connection and try again.',
        });
    };

    const handleLoadData = async (currentPage, pageSize, sort, search) => {
        var result = await ProductApi.getPaging(currentPage, pageSize, sort, search);
        if (result.data) {
            for (let i = 0; i < result.data.length; i++) {
                result.data[i].activeAt = FormatManager.formatDate(result.data[i].activeAt, 'YYYY-MM-DD');
            }
        }

        return result;
    };

    const handleRemoveData = async (removeData) => {
        if (removeData && removeData.id) {
            return ProductApi.removeById(removeData.id);
        } else if (Array.isArray(removeData) && removeData.length > 0) {
            const removeIds = removeData.map((item) => item.id);
            return ProductApi.removeAll(removeIds);
        }
    };

    const handleDetail = (item) => {
        let url = '/inventory/product/detail/';
        url += item ? item.id : 0;
        history.push(url);
    };

    const handleImport = async (result) => {
        // return RoleApi.importData(result);
    };

    const gridFields = [
        'code',
        'barCode',
        'barcodeType',
        'name',
        'categories',
        'shortDescription',
        'description',
        'tags',
        'currentBal',
        'minBal',
        'maxBal',
        'reorderBal',
        'uom',
        'status',
        'activeAt',
        'remark',
    ];

    return (
        <>
            <MasterTable
                hideImportMenu={true}
                title="Products"
                fields={PRODUCT_TABLE_FIELDS}
                importFields={[...gridFields]}
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

export default withRouter(Product);
