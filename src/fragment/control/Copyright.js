/* @flow */
import * as React from 'react';
import { Typography, Link } from '@material-ui/core';

export default function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © 2011-' + new Date().getFullYear() + ' '}
            <Link target="_blank" href="http://www.sundewmyanmar.com/">
                SUNDEW MYANMAR.
            </Link>
        </Typography>
    );
}
