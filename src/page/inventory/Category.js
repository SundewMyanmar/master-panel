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
        onLoad: (item) => item.name,
    },
    {
        name: 'icon',
        align: 'left',
        label: 'Icon',
        type: 'icon',
        sortable: true,
    },
];
