import React from 'react';
import MasterView from '../../component/MasterView';

const ROLE_API = 'roles/';
const DETAIL_PATH = '/role/setup/detail';
const TABLE_FIELDS = [
    {
        name: 'id',
        align: 'center',
        display_name: 'Id',
    },
    {
        name: 'name',
        align: 'left',
        display_name: 'Name',
    },
    {
        name: 'description',
        align: 'left',
        display_name: 'Description',
    },
    {
        name: '',
        align: 'center',
        display_name: 'Action',
    },
];

export default class RolePage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <MasterView title="Roles" detailPath={DETAIL_PATH} apiURL={ROLE_API} fields={TABLE_FIELDS} />
            </React.Fragment>
        );
    }
}
