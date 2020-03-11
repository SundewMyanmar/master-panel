import React from 'react';
import { withRouter } from 'react-router';
import { AlertDialog, Notification, LoadingDialog, QuestionDialog } from '../../fragment/message';
import MenuApi from '../../api/MenuApi';
import TreeMenu from '../../fragment/layout/TreeMenu';
import { Grid, Paper, Container, Avatar, Icon, Typography, Button, makeStyles } from '@material-ui/core';
import MasterForm from '../../fragment/MasterForm';
import { ROLE_TABLE_FIELDS } from './Role';
import RoleApi from '../../api/RoleApi';

export const MENU_TABLE_FIELDS = [
    {
        name: 'id',
        align: 'center',
        label: 'Id',
        sortable: true,
    },
    {
        name: 'icon',
        align: 'center',
        label: 'Icon',
        type: 'icon',
        sortable: true,
    },
    {
        name: 'label',
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
];

const styles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(4),
        padding: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        padding: theme.spacing(3),
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
    },
    treeBox: {
        overflow: 'auto',
        minHeight: 480,
        background: theme.palette.background.default,
        padding: theme.spacing(3),
        border: '1px solid ' + theme.palette.divider,
    },
    innerBox: {
        marginTop: theme.spacing(2),
    },
    inputBox: {
        paddingLeft: theme.spacing(5),
    },
    submit: {
        marginLeft: theme.spacing(1),
    },
    remove: {
        background: theme.palette.error.main,
        marginLeft: theme.spacing(1),
        color: theme.palette.error.contrastText,
        '&:hover': {
            background: theme.palette.error.dark,
        },
    },
}));

const INIT_MENU = {
    label: '',
    icon: '',
    divider: false,
    type: 'LINK',
    path: '',
    roles: [],
    description: '',
};

const Menu = props => {
    const classes = styles();

    const [error, setError] = React.useState('');
    const [noti, setNoti] = React.useState('');
    const [question, setQuestion] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [selectedMenu, setSelectedMenu] = React.useState(INIT_MENU);

    const handleError = error => {
        setError(error.message || 'Please check your internet connection and try again.');
        setLoading(false);
    };

    const handleParentMenuData = async (currentPage, pageSize, sort, search) => {
        return await MenuApi.getPaging(currentPage, pageSize, sort, search);
    };

    const handleRoleData = async (currentPage, pageSize, sort, search) => {
        return await RoleApi.getPaging(currentPage, pageSize, sort, search);
    };

    const loadData = async () => {
        const result = await MenuApi.getTree('');
        if (result && result.data) {
            setData(result.data);
            setLoading(false);
        }
    };

    const [data, setData] = React.useState(() => {
        loadData('');
        return [];
    });

    const handleSubmit = async form => {
        if (!window.navigator.onLine) {
            setError('Please check your internet connection and try again.');
            return;
        }
        setLoading(true);

        let menu = { ...form };
        delete menu.parent;
        if (form.parent && form.parent.id) {
            menu.parentId = form.parent.id;
        }

        if (selectedMenu && selectedMenu.id) {
            menu.id = selectedMenu.id;
            MenuApi.modifyById(selectedMenu.id, menu)
                .then(response => {
                    loadData();
                    setSelectedMenu(INIT_MENU);
                    setNoti('Modified menu : ' + response.id + '.');
                })
                .catch(handleError);
        } else {
            MenuApi.addNew(menu)
                .then(response => {
                    loadData();
                    setSelectedMenu(INIT_MENU);
                    setNoti('Created new menu : ' + response.id + '.');
                })
                .catch(handleError);
        }
    };

    const handleClickMenu = menu => {
        if (menu.parentId && menu.parentId > 0) {
            //Find Parent Menu
            const findParent = (childMenu, menuList) => {
                let parentMenu = menuList.find(m => m.id === menu.parentId);
                if (parentMenu) {
                    setSelectedMenu({ ...childMenu, parent: parentMenu });
                } else {
                    menuList.forEach(m => {
                        if (m.items) {
                            findParent(childMenu, m.items);
                        }
                    });
                }
            };
            findParent(menu, data);
        } else {
            setSelectedMenu(menu);
        }
    };
    const handleAdd = () => {
        let newMenu = INIT_MENU;
        if (selectedMenu && selectedMenu.id) {
            newMenu.parentId = selectedMenu.id;
            newMenu.parent = selectedMenu;
        }
        setSelectedMenu(newMenu);
    };
    const handleQuestionDialog = result => {
        if (result && selectedMenu && selectedMenu.id) {
            setLoading(true);
            MenuApi.removeById(selectedMenu.id)
                .then(() => {
                    setSelectedMenu(INIT_MENU);
                    loadData();
                    setNoti('Remove menu : ' + selectedMenu.id + '.');
                })
                .catch(handleError);
        }

        setQuestion('');
    };
    const handleRemove = () => {
        if (selectedMenu && selectedMenu.id) {
            setQuestion('Are you sure to remove ' + selectedMenu.label + '?');
        }
    };

    const fields = [
        {
            id: 'label',
            label: 'Label',
            icon: 'create',
            required: true,
            type: 'text',
            autoFocus: true,
            value: selectedMenu.label,
        },
        {
            id: 'icon',
            icon: 'eco',
            label: 'Icon',
            required: true,
            type: 'icon',
            value: selectedMenu.icon,
        },
        {
            id: 'divider',
            label: 'Has divider?',
            type: 'checkbox',
            checked: selectedMenu.divider || false,
        },
        {
            id: 'priority',
            label: 'Priority',
            icon: 'sort',
            type: 'number',
            value: selectedMenu.priority ? selectedMenu.priority.toString() : '0', //Don't display zero value
        },
        {
            id: 'path',
            icon: 'link',
            label: 'Path',
            type: 'text',
            value: selectedMenu.path || '',
        },
        {
            id: 'parent',
            icon: 'folder',
            label: 'Parent',
            type: 'table',
            fields: MENU_TABLE_FIELDS,
            onLoadData: handleParentMenuData,
            onLoadItem: item => item,
            value: selectedMenu.parent,
        },
        {
            id: 'roles',
            label: 'Roles',
            icon: 'people',
            type: 'table',
            multi: true,
            required: true,
            fields: ROLE_TABLE_FIELDS,
            onLoadData: handleRoleData,
            onLoadItem: item => item.name,
            values: selectedMenu.roles,
        },
        {
            id: 'description',
            label: 'Description',
            type: 'text',
            multiline: true,
            rows: '4',
            value: selectedMenu.description || '',
        },
    ];

    return (
        <>
            <Notification show={noti.length > 0} onClose={() => setNoti(false)} type="success" message={noti} />
            <AlertDialog onClose={() => setError('')} show={error.length > 0} title="Error" message={error} />
            <QuestionDialog show={question.length > 0} title="Confirm?" message={question} onClose={handleQuestionDialog} />
            <LoadingDialog show={loading} />
            <QuestionDialog />
            <Container component="main" maxWidth="md">
                <Paper className={classes.paper} elevation={6}>
                    <Avatar className={classes.avatar}>
                        <Icon>link</Icon>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        System Menu
                    </Typography>
                    <Grid className={classes.innerBox} container>
                        <Grid className={classes.treeBox} container item md={5} sm={12} xs={12} justify="center" alignContent="flex-start">
                            <TreeMenu menus={data} onClickItem={handleClickMenu} />
                        </Grid>
                        <Grid className={classes.inputBox} container item md={7} sm={12} xs={12} justify="flex-end" alignContent="flex-start">
                            <MasterForm fields={fields} onSubmit={(event, form) => handleSubmit(form)}>
                                <Grid container justify="flex-end">
                                    <Button type="button" variant="contained" color="default" onClick={handleAdd}>
                                        <Icon>add</Icon> Add New
                                    </Button>
                                    <Button type="submit" variant="contained" color="primary" className={classes.submit}>
                                        <Icon>save</Icon> Save
                                    </Button>
                                    {selectedMenu && selectedMenu.id ? (
                                        <Button type="button" variant="contained" className={classes.remove} onClick={handleRemove}>
                                            <Icon>delete</Icon> Delete
                                        </Button>
                                    ) : null}
                                </Grid>
                            </MasterForm>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </>
    );
};

export default withRouter(Menu);
