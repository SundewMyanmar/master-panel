import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

const ScrollBar = (props) => {
    return (
        <Scrollbars {...props} autoHide universal={false} hideTracksWhenNotNeeded={true} autoHideTimeout={500} autoHideDuration={200}>
            {props.children}
        </Scrollbars>
    );
};

export default ScrollBar;
