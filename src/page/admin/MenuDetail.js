import React from 'react';
import { withRouter } from 'react-router';
import { Typography } from '@material-ui/core';

class MenuDetail extends React.Component {
    render() {
        return (
            <>
                <Typography>Deafult Page</Typography>
            </>
        );
    }
}

export default withRouter(MenuDetail);
