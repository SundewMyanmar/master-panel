import React from 'react';
import { withRouter } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import {
    withTheme,
} from '@material-ui/core';

const Dashboard = (props) => {
    return <Typography variant="h1">Welcome</Typography>
};

export default withTheme(withRouter(Dashboard));
