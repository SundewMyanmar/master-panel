import React from 'react';
import MasterView from '../../component/MasterView';

const USER_API = 'users/';
const DETAIL_PATH = '/user/setup/detail';
const TABLE_FIELDS = [
    {
        name: 'id',
        align: 'center',
        display_name: 'ID',
        sortable: true,
    },
    {
        name: 'chat_bot_off',
        align: 'center',
        display_name: 'Chat Bot',
        type: 'CHECK',
    },
    {
        name: 'profile_image',
        align: 'center',
        display_name: 'Image',
        type: 'IMAGE',
    },
    {
        name: 'role_data',
        align: 'left',
        display_name: 'Roles',
    },
    {
        name: 'display_name',
        align: 'left',
        display_name: 'Name',
        sortable: true,
    },
    {
        name: 'email',
        align: 'left',
        display_name: 'Email',
        sortable: true,
    },
    {
        name: 'status',
        align: 'left',
        display_name: 'Status',
        sortable: true,
    },
    {
        name: '',
        align: 'center',
        display_name: 'Action',
        type: 'ACTION',
    },
];

export default class UserPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleData = result => {
        console.log('Result => ', result);
        for (var i = 0; i < result.data.length; i++) {
            var role = '';
            if (result.data[i].roles) {
                for (var j = 0; j < result.data[i].roles.length; j++) {
                    if (role !== '') role += ', ';

                    role += result.data[i].roles[j].name;
                }
            }
            result.data[i].role_data = role;
        }

        for (const data of result.data) {
            if (typeof data.display_name === 'object') {
                data.display_name = data.display_name.uni;
            }
            if (data.chat_bot_off === undefined || data.chat_bot_off === '') {
                data.chat_bot_off = 'Off';
            } else {
                data.chat_bot_off = data.chat_bot_off ? 'Off' : 'On';
            }
        }

        return result;
    };

    render() {
        return (
            <React.Fragment>
                <MasterView
                    title="Users"
                    detailPath={DETAIL_PATH}
                    apiURL={USER_API}
                    fields={TABLE_FIELDS}
                    onDataLoaded={this.handleData}
                    onCheckItemChange={this.handleCheckChange}
                />
            </React.Fragment>
        );
    }
}
