import React from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Paper, Avatar, Icon, Typography, InputAdornment, InputBase, makeStyles, Grid, Button } from '@material-ui/core';
import { TabControl, TinyEditorInput } from '../../fragment/control';
import FormatManager from '../../util/FormatManager';
import MasterForm from '../../fragment/MasterForm';

import { TABLE_FIELDS as CATEGORY_TABLE_FIELDS } from './Category';
import { TABLE_FIELDS as UOM_TABLE_FIELDS } from './UnitOfMeasurement';

import CategoryApi from '../../api/CategoryApi';
import UnitOfMeasurementApi from '../../api/UnitOfMeasurementApi';
import DataTable from '../../fragment/table';

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
    },
    {
        id: 'code',
        label: 'Code',
        icon: 'short_text',
        required: true,
        type: 'text',
        autoFocus: true,
    },
    {
        id: 'sku',
        label: 'Bar Code',
        icon: 'crop_free',
        required: true,
        type: 'text',
    },
    {
        id: 'name',
        label: 'Name',
        icon: 'widgets',
        required: true,
        type: 'text',
    },
    {
        id: 'shortDescription',
        label: 'Short Description',
        type: 'text',
        multiline: true,
        rows: '4',
    },
    {
        id: 'category',
        label: 'Categories',
        icon: 'extension',
        required: false,
        type: 'table',
        multi: true,
        fields: CATEGORY_TABLE_FIELDS,
        onLoadData: CategoryApi.getPaging,
        onLoadItem: (item) => item.name,
    },
    {
        id: 'activeAt',
        label: 'Active At',
        icon: 'date_range',
        required: false,
        type: 'date',
    },
    {
        id: 'status',
        label: 'Current Status',
        icon: 'linear_scale',
        type: 'list',
        data: ['Available', 'Out Of Stock', 'Canceled'],
    },
];

const InfoTab = (props) => {
    return <MasterForm fields={InfoFields} onSubmit={(event, form) => console.log(form)}></MasterForm>;
};

const DescriptionTab = (props) => {
    return <TinyEditorInput id="description" name="description" value={props.value} onChange={props.onChange} />;
};

const AttributeFields = [
    {
        id: 'brand',
        label: 'Product Brand',
        icon: 'card_travel',
        type: 'text',
    },
    {
        id: 'color',
        label: 'Color',
        icon: 'color_lens',
        type: 'color',
    },
    {
        id: 'packQty',
        label: 'Pack Quantity',
        icon: 'all_inbox',
        type: 'number',
        valid: 'integer',
        inputAdornment: (
            <InputAdornment position="end">
                <InputBase id="packQtyUnit" name="packQtyUnit" placeholder="Unit" />
            </InputAdornment>
        ),
    },
    {
        id: 'ingredients',
        label: 'Ingredients',
        type: 'text',
        multiline: true,
        rows: '4',
    },
    {
        id: 'usage',
        label: 'Usage',
        type: 'text',
        multiline: true,
        rows: '4',
    },
    {
        id: 'manufacturer',
        label: 'Manunfacturer',
        icon: 'flag',
        type: 'text',
    },
    {
        id: 'weight',
        label: 'Weight',
        icon: 'fitness_center',
        type: 'number',
        autoFocus: true,
        inputAdornment: (
            <InputAdornment position="end">
                <InputBase id="weightUnit" name="weightUnit" placeholder="Unit" />
            </InputAdornment>
        ),
    },
    {
        id: 'dimension',
        label: 'Dimension (W x L x H)',
        icon: 'zoom_out_map',
        type: 'text',
        inputAdornment: (
            <InputAdornment position="end">
                <InputBase id="dimensionUnit" name="dimensionUnit" placeholder="Unit" />
            </InputAdornment>
        ),
    },
];

const AttributeTab = (props) => {
    return <MasterForm fields={AttributeFields} onSubmit={(event, form) => console.log(form)}></MasterForm>;
};

const BalanceFields = [
    {
        id: 'current',
        label: 'Current Balance',
        icon: 'vertical_split',
        type: 'number',
        valid: 'integer',
        value: 0,
        disabled: true,
    },
    {
        id: 'min',
        label: 'Minimum Balance',
        icon: 'arrow_downward',
        type: 'number',
        valid: 'integer',
        autoFocus: true,
    },
    {
        id: 'max',
        label: 'Maximum Balance',
        icon: 'arrow_upward',
        type: 'number',
        valid: 'integer',
    },
    {
        id: 'reorder',
        label: 'Reorder Balance',
        icon: 'publish',
        type: 'number',
        valid: 'integer',
    },
    {
        id: 'uom',
        label: 'Unit Of Measurement',
        icon: 'speed',
        type: 'table',
        fields: UOM_TABLE_FIELDS,
        onLoadData: UnitOfMeasurementApi.getPaging,
        onLoadItem: (item) => item.name,
    },
];

const BalanceTab = (props) => {
    return <MasterForm fields={BalanceFields} onSubmit={(event, form) => console.log(form)}></MasterForm>;
};

const PricingFields = [
    {
        id: 'type',
        label: 'Type',
        icon: 'account_tree',
        type: 'list',
        data: ['Whole', 'Retail', 'Dealer'],
        autoFocus: true,
    },
    {
        id: 'startedAt',
        label: 'Start Date',
        icon: 'event_available',
        type: 'date',
    },
    {
        id: 'endAt',
        label: 'End Date',
        icon: 'event_busy',
        type: 'date',
    },
    {
        id: 'minQty',
        label: 'Minimum Order Qty',
        icon: 'all_inbox',
        type: 'number',
        valid: 'integer',
    },
    {
        id: 'pricePerUnit',
        label: 'Price Per Unit',
        icon: 'money',
        type: 'number',
        valid: 'decimal',
    },
    {
        id: 'changedPercent',
        label: 'Increase/Decrease %',
        icon: 'cached',
        type: 'number',
        valid: 'decimal',
    },
    {
        id: 'includeDelivery',
        label: 'Include Delivery Fees?',
        type: 'checkbox',
    },
    {
        id: 'includeTax',
        label: 'Include Tax?',
        type: 'checkbox',
    },
];

const PRICING_TABLE_FIELDS = [
    {
        name: 'startAt',
        align: 'center',
        label: 'From',
        sortable: true,
    },
    {
        name: 'endAt',
        align: 'center',
        label: 'To',
        sortable: true,
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

const PricingTab = (props) => {
    return (
        <>
            <MasterForm fields={PricingFields} onSubmit={(event, form) => console.log(form)}>
                <Grid container justifyContent="flex-end">
                    <Button type="button" variant="contained" color="primary" onClick={() => console.log('Add Price')}>
                        <Icon>add</Icon> Add Price
                    </Button>
                </Grid>
            </MasterForm>
            <DataTable
                title="Pricings"
                disablePaging={true}
                fields={PRICING_TABLE_FIELDS}
                items={[]}
                total={10}
                pageSize={10}
                currentPage={0}
                sort={'id:DESC'}
                onError={() => console.log('Error!')}
                onPageChange={() => console.log('Change Paging!')}
            />
        </>
    );
};

const ProductDetail = (props) => {
    const classes = styles();

    const tabFields = [
        {
            label: 'Info',
            icon: 'widgets',
            content: <InfoTab />,
        },
        {
            label: 'Full Description',
            icon: 'local_pharmacy',
            content: <DescriptionTab />,
        },
        {
            label: 'Attributes',
            icon: 'ballot',
            content: <AttributeTab />,
        },
        {
            label: 'Balance',
            icon: 'account_trees',
            content: <BalanceTab />,
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
                        <Button type="button" onClick={() => console.log('Submit')} variant="contained" color="primary" className={classes.submit}>
                            <Icon>save</Icon> Save
                        </Button>
                    </Grid>
                </Paper>
            </Container>
        </>
    );
};

export default withRouter(ProductDetail);
