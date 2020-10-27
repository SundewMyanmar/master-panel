import React, { Children } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

const ScrollBar = props => {
    console.log('sc child', props, props.name);
    return (
        <Scrollbars autoHide universal={true} hideTracksWhenNotNeeded={true} autoHideTimeout={500} autoHideDuration={200}>
            {props.children}
        </Scrollbars>
    );
};

export default ScrollBar;
