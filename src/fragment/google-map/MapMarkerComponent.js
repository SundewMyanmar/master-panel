import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { MarkerWithLabel } from 'react-google-maps/lib/components/addons/MarkerWithLabel';
import { MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer';
import MapComponent from '../google-map';

//TODO: Add edit and remove Func for markers
const styles = makeStyles((theme) => ({
    markerLabel: {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        fontSize: '14px',
        padding: '0px',
        borderRadius: 5,
        opacity: 0.6,
        zIndex: 1000,
    },
    padding: { padding: theme.spacing(1) },
}));

const DEFAULT_GRID_SIZE = 60;

export interface MarkerComonentProps {
    position: object;
    description: string;
    onClick?: () => void;
}

export const MarkerComponent = (props: MarkerComonentProps) => {
    const classes = styles();
    const { position, description, onClick } = props;
    const [showMarkerInfo, setShowMarkerInfo] = useState(false);
    const handleMarkerClick = (pos) => {
        setShowMarkerInfo(!showMarkerInfo);

        if (onClick) {
            onClick(pos);
        }

        if (!showMarkerInfo) {
            setTimeout(() => setShowMarkerInfo(false), 3000);
        }
    };

    return (
        <>
            <MarkerWithLabel
                labelAnchor={new window.google.maps.Point(0, 0)}
                position={position}
                onClick={() => {
                    handleMarkerClick(position);
                }}
                onMouseOver={handleMarkerClick}
            >
                <div className={classes.markerLabel}>{showMarkerInfo && <div className={classes.padding}>{props.description}</div>}</div>
            </MarkerWithLabel>
        </>
    );
};

export interface MapMarkerComponentProps {
    markers: Array<Object>;
    allowCluster: boolean;
    clustererGridSize: number;
    defaultZoom: number;
    defaultCenter: object;
    childElement: object;
    allowDrawing: boolean;
    /**
     * DRAWING MODES=> 'circle' | 'marker' | 'polygon' | 'polyline' | 'rectangle'
     */
    drawingModes: Array<string>;
    onMarkerComplete?: () => void;
}

const MapMarkerComponent = (props: MapMarkerComponentProps) => {
    const { markers, allowCluster, clustererGridSize, drawingModes, onMarkerComplete } = props;

    var markerElements =
        markers && markers.map((m) => <MarkerComponent key={`marker-${markers.indexOf(m)}`} description={m.description} position={m} />);

    if (allowCluster)
        markerElements = (
            <MarkerClusterer averageCenter enableRetinaIcons gridSize={clustererGridSize || DEFAULT_GRID_SIZE}>
                {markerElements}
            </MarkerClusterer>
        );

    return (
        <>
            <MapComponent
                {...props}
                drawingModes={['marker', ...(drawingModes || [])]}
                childElement={<>{markerElements}</>}
                onMarkerComplete={onMarkerComplete}
            />
        </>
    );
};

MapMarkerComponent.defaultProps = {};

export default MapMarkerComponent;
