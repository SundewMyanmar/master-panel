import React from 'react';
import { withRouter } from "react-router";
import Typography from '@material-ui/core/Typography';

import MasterTemplate from '../../component/MasterTemplate';

class PermissionPage extends React.Component{
    render(){
        return(
            <MasterTemplate>
                <Typography component="h1" variant="headline" gutterBottom>
                    Permission Page
                </Typography>
            </MasterTemplate>            
        );
    }
}

export default withRouter(PermissionPage);