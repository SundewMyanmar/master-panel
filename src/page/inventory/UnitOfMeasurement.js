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
        name: 'relation',
        align: 'right',
        label: 'Relation',
        sortable: true,
    },
];
