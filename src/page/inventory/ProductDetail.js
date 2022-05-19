import React, { useState } from 'react';
import { withRouter, useHistory, useParams } from 'react-router-dom';
import { Container, Paper, Avatar, Icon, Typography, InputAdornment, InputBase, makeStyles, Grid, Button } from '@material-ui/core';
import { ListInput, TabControl, TinyEditorInput } from '../../fragment/control';
import FormatManager from '../../util/FormatManager';
import MasterForm from '../../fragment/MasterForm';
import FileApi from '../../api/FileApi';
import { TABLE_FIELDS as CATEGORY_TABLE_FIELDS } from './Category';
import { TABLE_FIELDS as UOM_TABLE_FIELDS } from './UnitOfMeasurement';
import ProductApi from '../../api/ProductApi';
import CategoryApi from '../../api/CategoryApi';
import AttributeApi from '../../api/AttributeApi';
import UnitOfMeasurementApi from '../../api/UnitOfMeasurementApi';
import DataTable from '../../fragment/table';
import { ALERT_REDUX_ACTIONS } from '../../util/AlertManager';
import { useDispatch } from 'react-redux';
import { FLASH_REDUX_ACTIONS } from '../../util/FlashManager';
import { validateForm } from '../../util/ValidationManager';
import { STATUS } from '../../config/Constant';
import AttributeForm from '../../form/AttributeForm';
import ProductPricingApi from '../../api/ProductPricingApi';

const styles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        padding: theme.spacing(3),
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
    },
    submit: {
        marginLeft: theme.spacing(1),
    },
    gridBottom: { marginBottom: 6 },
    inputAdornment: {
        borderLeft: '2px solid ' + theme.palette.divider,
        paddingLeft: theme.spacing(1.5),
        width: 65,
    },
    searchInput: {
        paddingBottom: theme.spacing(1),
    },
}));

const ProductDetail = (props) => {
    const classes = styles();
    const history = useHistory();
    const dispatch = useDispatch();
    const { id } = useParams();
    const [isUpdate, setUpdate] = useState(id > 0);
    const [attributeDatas, setAttributeDatas] = useState([]);
    const [barcodeTypes, setBarcodeTypes] = useState(() => {
        ProductApi.getBarcodeTypes().then((data) => {
            setBarcodeTypes(data);
        }).catch((error) => {
            if (error.code !== 'HTTP_406') {
                handleError(error);
            } else {
                setUpdate(false);
            }
        });
        return [];
    })

    const [attributes, setAttributes] = useState(() => {
        AttributeApi.getAllAttribute().then((data) => {
            setAttributes(data)
        }).catch((error) => {
            if (error.code !== 'HTTP_406') {
                handleError(error);
            } else {
                setUpdate(false);
            }
        });
        return [];
    })

    const handleError = (error) => {
        dispatch({
            type: ALERT_REDUX_ACTIONS.SHOW,
            alert: error || 'Please check your internet connection and try again.',
        });
    };

    const handleCategoryData = async (currentPage, pageSize, sort, search) => {
        return await CategoryApi.getPaging(currentPage, pageSize, sort, search);
    }

    const handleUOMData = async (currentPage, pageSize, sort, search) => {
        return UnitOfMeasurementApi.getPaging(currentPage, pageSize, sort, search);
    }

    const [detail, setDetail] = useState(() => {
        if (id && id > 0)
            ProductApi.getById(id)
                .then((data) => {
                    let newImages = [];
                    let dbImages = JSON.parse(JSON.stringify(data.attachments || []));
                    let len = dbImages ? dbImages.length : 0;
                    for (let i = 0; i < len; i++) {
                        newImages.push(dbImages[i].file);
                    }
                    let tags = data.tags ? data.tags.join(',') : '';
                    setDetail({
                        ...data,
                        tags: tags,
                        images: newImages,
                        dbImages: dbImages
                    });
                    setAttributeDatas(data.attributes);
                })
                .catch((error) => {
                    if (error.code !== 'HTTP_406') {
                        handleError(error);
                    } else {
                        setUpdate(false);
                    }
                });
        return {};
    });

    const handleAttributeChange = (event, index) => {
        setAttributeDatas(event.target.value);
        console.log('attribute change', event.target.value);
    }

    const handleFormChange = (event, index) => {
        let value = event.target.value;
        if (event.target.type === 'multi-image') {
            if (index || index == 0) {
                value = detail.images || [];
                if (!value[index]) {
                    value.push(event.target.value);
                } else {
                    value[index] = event.target.value;
                }
            } else {
                value = event.target.value || [];
            }
        }

        setDetail({
            ...detail,
            [event.target.name]: value,
        });
    }

    const handleSubmit = async () => {
        if (!window.navigator.onLine) {
            handleError('Please check your internet connection and try again.');
            return;
        }

        if (
            !validateForm(
                detail,
                [
                    { fieldId: 'code', required: true },
                    { fieldId: 'name', required: true },
                ],
                handleError,
            )
        ) {
            return;
        }

        let images = [];
        if (detail.images && detail.images.length > 0) {
            for (let i = 0; i < detail.images.length; i++) {
                let img = detail.images[i];
                let oldImg;

                if (img == null) continue;

                if (Object.entries(img).length === 0 && !img.name) continue;
                if (img.id) {
                    if (detail.dbImages) {
                        for (let j = 0; j < detail.dbImages.length; j++) {
                            if (detail.dbImages[j].file.id == img.id) {
                                oldImg = detail.dbImages[i] || {};
                            }
                        }
                    }

                    let fileResult = {
                        file: img,
                        title: img.name,
                        type: img.type,
                        priority: i,
                    };
                    if (isUpdate) fileResult.productId = detail.id;
                    if (oldImg) fileResult = { ...oldImg, ...fileResult };

                    images.push(fileResult);
                } else {
                    const fileResponse = await FileApi.upload(img, true, false, null, 'PRODUCT');

                    if (fileResponse) {
                        let fileResult = {
                            file: fileResponse,
                            title: fileResponse.name,
                            type: fileResponse.type,
                            priority: i,
                        };
                        if (isUpdate) fileResult.productId = detail.id;
                        images.push(fileResult);
                    }
                }
            }
        }

        let product = {
            ...detail,
            currentBal: detail.currentBal ? detail.currentBal * 1 : 0,
            minBal: detail.minBal ? detail.minBal * 1 : 0,
            maxBal: detail.maxBal ? detail.maxBal * 1 : 0,
            reorderBal: detail.reorderBal ? detail.reorderBal * 1 : 0,
            tags: detail.tags.split(','),
            attachments: images,
        }
        delete product.images;
        delete product.dbImages;
        product.attributes = attributeDatas;

        if (isUpdate) {
            product.id = detail.id;
            product.version = detail.version;

            ProductApi.modifyById(detail.id, product)
                .then(response => {
                    dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
                    dispatch({
                        type: FLASH_REDUX_ACTIONS.SHOW,
                        flash: { type: 'success', message: `Modified product : ${response.id} .` },
                    });
                    history.push('/inventory/product');
                })
                .catch(handleError);
        } else {
            ProductApi.addNew(product)
                .then(response => {
                    dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
                    dispatch({
                        type: FLASH_REDUX_ACTIONS.SHOW,
                        flash: { type: 'success', message: `Created new product : ${response.id} .` },
                    });
                    history.push('/inventory/product');
                })
                .catch(handleError);
        }
    }

    const onLoadAttributeValue = (item) => {
        const type = item.attribute.type.toLowerCase();
        let value = item.value;
        switch (type) {
            case 'integer':
            case 'decimal':
                value = FormatManager.thousandSeparator(item.value);
                break;
            case 'date':
                value = FormatManager.formatDate(item.value, 'yyyy LLL dd');
                break;
            case 'datetime':
                value = FormatManager.formatDate(item.value, 'yyyy LLL dd h:m a');
                break;
            case 'time':
                value = FormatManager.formatDate(item.value, 'h:m a');
                break;
        }

        if (item.attribute.hasUom) {
            return value + ' ' + item.uom.code;
        }

        return value;
    };

    const InfoFields = [
        {
            id: 'images',
            type: 'multi-image',
            enableFilePicker: true,
            align: 'center',
            required: true,
            size: { width: 200, height: 200 },
            values: detail.images ? detail.images : null,
        },
        {
            id: 'code',
            label: 'Code',
            icon: 'short_text',
            required: true,
            type: 'text',
            autoFocus: true,
            value: detail.code
        },
        {
            id: 'barCode',
            label: 'Bar Code',
            icon: 'crop_free',
            required: true,
            type: 'text',
            value: detail.barCode,
            inputAdornment: (
                <InputAdornment style={{ width: 140 }} position="end">
                    <ListInput id='barcodeType'
                        hidePlaceHolder={true}
                        label='Barcode Type'
                        type='list'
                        data={barcodeTypes}
                        variant='standard'
                        onChange={handleFormChange}
                        value={detail.barcodeType} />
                </InputAdornment>
            ),
        },
        {
            id: 'name',
            label: 'Name',
            icon: 'widgets',
            required: true,
            type: 'text',
            value: detail.name
        },
        {
            id: 'categories',
            label: 'Categories',
            icon: 'toc',
            required: false,
            type: 'table',
            multi: true,
            fields: CATEGORY_TABLE_FIELDS,
            values: detail.categories,
            onLoadData: handleCategoryData,
            onLoadItem: (item) => item.name,
        },
        {
            id: 'shortDescription',
            label: 'Short Description',
            type: 'text',
            multiline: true,
            rows: '4',
            value: detail.shortDescription
        },
        {
            id: 'tags',
            label: 'Tags',
            type: 'chip',
            icon: 'tag',
            rows: '4',
            value: detail.tags
        },
        {
            id: 'activeAt',
            label: 'Active At',
            icon: 'date_range',
            required: false,
            type: 'date',
            value: detail.activeAt,
        },
        {
            id: 'status',
            label: 'Current Status',
            icon: 'linear_scale',
            type: 'list',
            data: STATUS,
            value: detail.status
        },
    ];

    const InfoTab = (props) => {
        return <MasterForm initialData={detail} fields={InfoFields} onChange={handleFormChange}></MasterForm>;
    };

    const DescriptionTab = (props) => {
        return <TinyEditorInput id="description" name="description" value={detail.description} onChange={handleFormChange} />;
    };

    const BalanceFields = [
        {
            id: 'currentBal',
            label: 'Current Balance',
            icon: 'vertical_split',
            type: 'number',
            valid: 'integer',
            disabled: true,
            value: detail.currentBal,
        },
        {
            id: 'minBal',
            label: 'Minimum Balance',
            icon: 'arrow_downward',
            type: 'number',
            valid: 'integer',
            autoFocus: true,
            value: detail.minBal,
        },
        {
            id: 'maxBal',
            label: 'Maximum Balance',
            icon: 'arrow_upward',
            type: 'number',
            valid: 'integer',
            value: detail.maxBal,
        },
        {
            id: 'reorderBal',
            label: 'Reorder Balance',
            icon: 'publish',
            type: 'number',
            valid: 'integer',
            value: detail.reorderBal,
        },
        {
            id: 'uom',
            label: 'Unit Of Measurement',
            icon: 'speed',
            type: 'table',
            fields: UOM_TABLE_FIELDS,
            value: detail.uom,
            onLoadData: handleUOMData,
            onLoadItem: (item) => item.name,
        },
    ];

    const BalanceTab = (props) => {
        return <MasterForm fields={BalanceFields} onChange={handleFormChange} onSubmit={(event, form) => console.log(form)}></MasterForm>;
    };

    const PRICING_TABLE_FIELDS = [
        {
            name: 'startedAt',
            align: 'center',
            label: 'From',
            sortable: true,
            onLoad: (item) => item.startedAt ? FormatManager.formatDate(item.startedAt, 'yyyy LLL dd') : '-'
        },
        {
            name: 'endAt',
            align: 'center',
            label: 'To',
            sortable: true,
            onLoad: (item) => item.endAt ? FormatManager.formatDate(item.endAt, 'yyyy LLL dd') : '-'
        },
        {
            name: 'type',
            align: 'left',
            label: 'Sale Type',
            sortable: true,
        },
        {
            name: 'minQty',
            align: 'right',
            label: 'Min Qty',
            sortable: true,
        },
        {
            name: 'pricePerUnit',
            align: 'right',
            label: 'Price',
            sortable: true,
        },
        {
            name: 'changedPercent',
            align: 'right',
            label: 'Changed %',
            sortable: true,
        },
        {
            name: 'includedDelivery',
            align: 'center',
            label: 'Delivery',
            type: 'bool',
            width: 50,
            sortable: true,
        },
        {
            name: 'includedTax',
            align: 'center',
            label: 'Tax',
            type: 'bool',
            width: 50,
            sortable: true,
        },
    ];

    const [paging, setPaging] = useState(async () => {
        let pagination = {
            currentPage: 0,
            pageSize: 10,
            total: 0,
            data: [],
            sort: 'id:DESC',
        };
        try {
            const result = await ProductPricingApi.fakePaging(0, pagination.pageSize, pagination.sort);

            if (result) {
                setPaging(result);
            }
        } catch (error) {
            handleError(error);
        }

        return pagination;
    });

    const PricingTab = (props) => {
        return (
            <>
                <DataTable
                    title="Pricings"
                    disablePaging={true}
                    fields={PRICING_TABLE_FIELDS}
                    items={paging.data}
                    total={paging.total}
                    pageSize={paging.pageSize}
                    currentPage={paging.currentPage}
                    sort={'id:DESC'}
                    onError={() => console.log('Error!')}
                    onPageChange={() => console.log('page change')}
                />
            </>
        );
    };

    const tabFields = [

        {
            label: 'Info',
            icon: 'widgets',
            content: InfoTab(),
        },
        {
            label: 'Full Description',
            icon: 'local_pharmacy',
            content: DescriptionTab(),
        },
        {
            label: 'Attributes',
            icon: 'ballot',
            content: <AttributeForm id="attributes" name="attributes" structure={attributes} data={detail.attributes} onChange={handleAttributeChange} />,
        },
        {
            label: 'Balance',
            icon: 'account_trees',
            content: BalanceTab(),
        },
        {
            label: 'Pricings',
            icon: 'local_atm',
            content: <PricingTab />,
        },

        // {
        //     label: 'Assembly',
        //     icon: 'archive',
        //     content: <AssemblyTab />,
        // },
        // {
        //     label: 'Related Product',
        //     icon: 'loyalty',
        //     content: <RelationTab />,
        // },
        // {
        //     label: 'Reviews',
        //     icon: 'rate_review',
        //     content: <ReviewsTab />,
        // },
    ];

    return (
        <>
            <Container maxWidth="xl">
                <Paper className={classes.paper} elevation={6}>
                    <Avatar className={classes.avatar}>
                        <Icon>widgets</Icon>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Product Setup
                    </Typography>
                    <TabControl tabs={tabFields}></TabControl>
                    <Grid container justifyContent="flex-end">
                        <Button type="button" variant="contained" color="default" onClick={() => history.push('/inventory/product')}>
                            <Icon>arrow_back</Icon> Back to List
                        </Button>
                        <Button type="button" onClick={handleSubmit} variant="contained" color="primary" className={classes.submit}>
                            <Icon>save</Icon> Save
                        </Button>
                    </Grid>
                </Paper>
            </Container>
        </>
    );
};

export default withRouter(ProductDetail);
