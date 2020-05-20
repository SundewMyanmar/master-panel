import React, { useState, useEffect, Component, Children } from 'react';
import { createPortal } from 'react-dom';
import { compose, withProps } from 'recompose';
import { Typography, makeStyles, Grid, Icon, Button } from '@material-ui/core';
import { GOOGLE_API_KEYS, DEFAULT_SIDE_MENU } from '../../config/Constant';
import { withScriptjs, withGoogleMap, GoogleMap, Circle, DirectionsRenderer, Rectangle, InfoWindow, Marker, Polygon } from 'react-google-maps';
import { InfoBox } from 'react-google-maps/lib/components/addons/InfoBox';
import { MarkerWithLabel } from 'react-google-maps/lib/components/addons/MarkerWithLabel';
import { MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer';
import { DrawingManager } from 'react-google-maps/lib/components/drawing/DrawingManager';
import { SearchBox } from 'react-google-maps/lib/components/places/SearchBox';
import MapControl from '../google-map/MapMarkerComponent';

//TODO: separate Marker, MarkerWithLabel or Marker, Circle, DirectionsRenderer(need billing),Drawing Manager
//TODO: create props Type
//NOTE: discard Rectangle
//TODO: Add Map Search func (need billing)

export const rawStyles = {
    element: { height: '100%' },
    drawerElement: {
        strokeColor: '#0ee8b9',
        fillColor: '#0ee8b9',
        opacity: 0.8,
        strokeWeight: '2',
    },
    infoBox: {
        backgroundColor: '#0ee8b9',
        opacity: 0.8,
        padding: 12,
        width: 'auto',
    },
    infoText: {
        fontSize: 12,
        fontColor: '#109b7e',
    },
};

const styles = makeStyles(theme => ({
    markerLabel: { backgroundColor: 'yellow', fontSize: '18px', padding: '0px', borderRadius: 5, opacity: 0.8 },

    ...rawStyles,
}));

const DEFAULT_HEIGHT = 400;
const DEFAULT_ZOOM = 8;
export const DEFAULT_CENTER = { lat: 16.785872, lng: 96.154541 };

export type MapComponentProps = {
    defaultZoom: number,
    defaultCenter: Object,
    childElement: Object,
    allowDrawing: boolean,
    /**
     * DRAWING MODES=> 'circle' | 'marker' | 'polygon' | 'polyline' | 'rectangle'
     */
    drawingModes: Array<String>,
    onMarkerComplete?: ?Function,
    onCircleComplete?: ?Function,
    onPolygonComplete?: ?Function,
};

const MapComponent = compose(
    withProps((props: MapComponentProps) => {
        return {
            googleMapURL: 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=' + GOOGLE_API_KEYS,
            loadingElement: <div style={rawStyles.element} />,
            containerElement: <div style={{ height: props.height || DEFAULT_HEIGHT }} />,
            mapElement: <div style={rawStyles.element} />,
        };
    }),
    withScriptjs,
    withGoogleMap,
)((props: MapComponentProps) => {
    const classes = styles();
    const { defaultZoom, defaultCenter, childElement, allowDrawing, drawingModes, onMarkerComplete, onCircleComplete, onPolygonComplete } = props;

    const handleOnMarkerComplete = mk => {
        if (onMarkerComplete) onMarkerComplete(mk);
    };

    const handleOnCircleComplete = cc => {
        if (onCircleComplete) onCircleComplete(cc);
    };

    const handleOnPolygonComplete = pg => {
        if (onPolygonComplete) onPolygonComplete(pg);
    };

    const map = React.createRef();

    return (
        <>
            <GoogleMap ref={map} defaultZoom={defaultZoom || DEFAULT_ZOOM} defaultCenter={defaultCenter || DEFAULT_CENTER} {...props}>
                {childElement || <></>}
                {allowDrawing && (
                    <DrawingManager
                        onMarkerComplete={handleOnMarkerComplete}
                        onCircleComplete={handleOnCircleComplete}
                        onPolygonComplete={handleOnPolygonComplete}
                        defaultOptions={{
                            drawingControl: true,
                            drawingControlOptions: {
                                position: window.google.maps.ControlPosition.TOP_CENTER,
                                drawingModes: drawingModes,
                            },
                            markerOptions: {
                                clickable: true,
                                draggable: true,
                                ...rawStyles.drawerElement,
                            },
                            circleOptions: {
                                clickable: true,
                                draggable: true,
                                ...rawStyles.drawerElement,
                            },
                            polygonOptions: {
                                clickable: true,
                                draggable: true,
                                ...rawStyles.drawerElement,
                            },
                        }}
                    />
                )}
            </GoogleMap>
        </>
    );
});

MapComponent.defaultProps = {};

export default MapComponent;
