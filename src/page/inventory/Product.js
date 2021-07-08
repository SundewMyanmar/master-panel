import React from 'react';
import { withRouter, useHistory, useLocation } from 'react-router';
import MasterTable from '../../fragment/MasterTable';
import { AlertDialog, Notification } from '../../fragment/message';
import ProductApi from '../../api/ProductApi';
import { STORAGE_KEYS } from '../../config/Constant';
import FormatManager from '../../util/FormatManager';

export const PRODUCT_TABLE_FIELDS = [
    {
        name: 'id',
        align: 'center',
        label: 'Id',
        sortable: true,
    },
    {
        name: 'images',
        align: 'center',
        label: 'Image',
        type: 'image',
        onLoad: (item) =>
            item.images && item.images.length > 0 && item.images[0].image
                ? item.images[0].image.urls.private || item.images[0].image.urls.public
                : null,
    },
    // {
    //     name: 'image2',
    //     align: 'center',
    //     label: 'Image2',
    //     type: 'image',
    // },
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
        name: 'brand',
        align: 'left',
        label: 'Brand',
        sortable: true,
        onLoad: (item) => (item.brand ? item.brand.name : ''),
    },
    {
        name: 'category',
        align: 'left',
        label: 'Category',
        sortable: true,
        onLoad: (item) => (item.category ? item.category.name : ''),
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
    // {
    //     name: 'tag',
    //     align: 'left',
    //     label: 'Tag',
    //     sortable: true,
    // },
    {
        name: 'tabletCount',
        align: 'right',
        label: 'Tablet Count',
        sortable: true,
        onLoad: (item) => item.tabletCount,
    },
    {
        name: 'potency',
        align: 'center',
        label: 'Potency',
        sortable: true,
        onLoad: (item) => item.potency,
    },
    // {
    //     name: 'shippingWeight',
    //     align: 'left',
    //     label: 'Shipping Wgh',
    //     sortable: true,
    // },
    // {
    //     name: 'reorderLevel',
    //     align: 'left',
    //     label: 'Reorder Lvl',
    //     sortable: true,
    // },
    // {
    //     name: 'packageQuantity',
    //     align: 'left',
    //     label: 'Package Qty',
    //     sortable: true,
    // },
    // {
    //     name: 'dimension',
    //     align: 'left',
    //     label: 'Dimension',
    //     sortable: true,
    // },
    {
        name: 'isBatch',
        align: 'left',
        label: 'Batch',
        type: 'bool',
        sortable: true,
        width: 50,
        onLoad: (item) => item.isBatch,
    },
    {
        name: 'isBestSelling',
        align: 'left',
        label: 'Best Selling',
        type: 'bool',
        sortable: true,
        width: 50,
        onLoad: (item) => item.isBestSelling,
    },
    {
        name: 'needAttachment',
        align: 'left',
        label: 'Attachment',
        type: 'bool',
        sortable: true,
        width: 50,
        onLoad: (item) => item.needAttachment,
    },
    // {
    //     name: 'points',
    //     align: 'left',
    //     label: 'Points',
    //     sortable: true,
    // },
    // {
    //     name: 'wsMinBalance',
    //     align: 'left',
    //     label: 'Ws Min Balance',
    //     sortable: true,
    // },
    // {
    //     name: 'remark',
    //     align: 'left',
    //     label: 'Remark',
    //     sortable: true,
    // },
    // {
    //     name: 'isActive',
    //     align: 'left',
    //     label: 'Active',
    //     type: 'bool',
    //     sortable: true,
    //     width: 50,
    //     onLoad: item => item.isActive,
    // },
];

const Product = (props) => {
    const location = useLocation();
    const history = useHistory();

    const [error, setError] = React.useState('');
    const [noti, setNoti] = React.useState(() => {
        const flashMessage = sessionStorage.getItem(STORAGE_KEYS.FLASH_MESSAGE);
        return flashMessage || '';
    });

    const handleError = (error) => {
        setError(error.message || error.title || 'Please check your internet connection and try again.');
    };

    const handleLoadData = async (currentPage, pageSize, sort, search) => {
        var result = await ProductApi.getPaging(currentPage, pageSize, sort, search);
        if (result.data) {
            for (let i = 0; i < result.data.length; i++) {
                result.data[i].activeAt = FormatManager.formatDate(result.data[i].activeAt, 'YYYY-MM-DD');
            }
        }
        console.log('product list', result);
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
        'name',
        'brand',
        'category',
        'tag',
        'activeAt',
        'isBatch',
        'isBestSelling',
        'needAttachment',
        'description',
        'supplementFacts',
        'points',
        'wsMinBalance',
        'tabletCount',
        'potency',
        'shippingWeight',
        'reorderLvl',
        'packageQty',
        'dimension',
        'remark',
    ];

    return (
        <>
            <Notification show={noti.length > 0} onClose={() => setNoti(false)} type="success" message={noti} />
            <AlertDialog onClose={() => setError('')} show={error.length > 0} title="Error" message={error} />
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
