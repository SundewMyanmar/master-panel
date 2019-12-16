import React from 'react';
import MasterView from '../../component/MasterView';

const ROLE_API = 'menus/';
const DETAIL_PATH = '/menu/setup/detail';
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
        name: 'icon',
        align: 'left',
        display_name: 'Icon',
    },
    {
        name: 'state',
        align: 'left',
        display_name: 'State',
    },
    {
        name: 'type',
        align: 'left',
        display_name: 'Type',
    },
    {
        name: 'role_data',
        align: 'left',
        display_name: 'Roles',
    },
    {
        name: 'child_menu',
        align: 'left',
        display_name: 'Child Menu',
    },
    {
        name: 'is_divider',
        align: 'center',
        display_name: 'Divider',
        read_only: true,
        type: 'CHECK',
    },
    {
        name: '',
        align: 'center',
        display_name: 'Action',
    },
];

export default class MenuPage extends React.Component {
    constructor(props) {
        super(props);
    }

    handleData = result => {
        for (var i = 0; i < result.data.length; i++) {
            var role = '';
            var menu = '';
            if (result.data[i].roles) {
                for (var j = 0; j < result.data[i].roles.length; j++) {
                    if (role !== '') role += ', ';

                    role += result.data[i].roles[j].name;
                }
            }
            if (result.data[i].children) {
                for (var k = 0; k < result.data[i].children.length; k++) {
                    if (menu !== '') menu += ', ';

                    menu += result.data[i].children[k].name;
                }
            }
            result.data[i].role_data = role;
            result.data[i].child_menu = menu;
            result.data[i].is_divider = result.data[i].divider ? 'True' : 'False';
        }

        return result;
    };

    render() {
        return (
            <React.Fragment>
                <MasterView title="Menus" detailPath={DETAIL_PATH} apiURL={ROLE_API} fields={TABLE_FIELDS} onDataLoaded={this.handleData} />
            </React.Fragment>
        );
    }
}
