import React from 'react';
import { Circle } from 'react-google-maps';
import MapComponent, { rawStyles } from '.';

//TODO: Add edit and remove Func for circles

export type MapCircleComponentProps = {
    circles: Array<Object>,
    circleOptions: Object,
    defaultZoom: number,
    defaultCenter: Object,
    childElement: Object,
    allowDrawing: boolean,
    /**
     * DRAWING MODES=> 'circle' | 'marker' | 'polygon' | 'polyline' | 'rectangle'
     */
    drawingModes: Array<string>,
    onCircleComplete?: () => void,
};

const MapCircleComponent = (props: MapCircleComponentProps) => {
    const { drawingModes, circles, circleOptions, draggable, onClick, onCircleComplete } = props;

    const handelOnClick = (cc) => {
        if (onClick) onclick(cc);
    };

    const circleElements =
        circles &&
        circles.map((cc) => (
            <Circle
                key={`circle-${circles.indexOf(cc)}`}
                defaultCenter={cc.defaultCenter}
                radius={cc.radius || 0}
                onClick={() => handelOnClick(cc)}
                draggable={draggable}
                options={circleOptions || rawStyles.drawerElement}
            />
        ));

    return (
        <>
            <MapComponent
                {...props}
                drawingModes={['circle', ...(drawingModes || [])]}
                childElement={<>{circleElements}</>}
                onCircleComplete={onCircleComplete}
            />
        </>
    );
};

export default MapCircleComponent;
