import React from 'react';
import { withRouter } from 'react-router-dom';
import { Typography } from '@material-ui/core';

const Dashboard = (props) => {
    return (
        <React.Fragment>
            <Typography variant="h1">Welcome</Typography>
        </React.Fragment>
    );
};

export default withRouter(Dashboard);
