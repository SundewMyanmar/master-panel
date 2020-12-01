import React, { useState } from 'react';
import { Polygon } from 'react-google-maps';
import { InfoBox } from 'react-google-maps/lib/components/addons/InfoBox';
import MapComponent, { rawStyles, DEFAULT_CENTER } from '../google-map';

//TODO: Add edit and remove Func for polygons

export type MapPolygonComponentProps = {
    polygons: Array<Object>,
    /**
     * DRAWING MODES=> 'circle' | 'marker' | 'polygon' | 'polyline' | 'rectangle'
     */
    drawingModes: Array<string>,
    polygonOptions: Object,
    draggable: Boolean,
    defaultZoom: number,
    defaultCenter: Object,
    childElement: Object,
    allowDrawing: boolean,
    onClick?: () => void,
    onPolygonComplete?: () => void,
};

const MapPolygonComponent = (props: MapPolygonComponent) => {
    const { polygons, drawingModes, polygonOptions, draggable, onClick, onPolygonComplete } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [focusPosition, setFocusPosition] = useState({ lat: 0, lng: 0 });
    const [focusPolygon, setFocusPolygon] = useState(null);
    const [clickedPolygon, setClickedPolygon] = useState(null);

    const handleOnClick = pg => {
        if (onClick) onClick(pg);
    };

    var polygonElements =
        polygons &&
        polygons.map(pg => (
            <Polygon
                onClick={() => {
                    console.log('PG', pg);
                    handleOnClick(pg);
                    setClickedPolygon(pg);
                }}
                onMouseOver={() => {
                    setFocusPolygon(pg);
                    setFocusPosition(new window.google.maps.LatLng(pg.defaultCenter.lat, pg.defaultCenter.lng));
                    setIsOpen(true);
                }}
                onMouseOut={() => {
                    setIsOpen(false);
                }}
                key={`polygon-${polygons.indexOf(pg)}`}
                options={polygonOptions || rawStyles.drawerElement}
                paths={pg.paths}
                draggable={draggable}
            ></Polygon>
        ));

    return (
        <>
            <MapComponent
                {...props}
                drawingModes={['polygon', ...(drawingModes || [])]}
                childElement={
                    <>
                        {polygonElements}
                        {isOpen && (
                            <InfoBox position={focusPosition} options={{ closeBoxURL: ``, enableEventPropagation: true }}>
                                <div style={rawStyles.infoBox}>
                                    <div style={rawStyles.infoText}>
                                        {`${focusPolygon && focusPolygon.VT} ${focusPolygon &&
                                            focusPolygon.VT_MYA_M3 &&
                                            ' - ' + focusPolygon.VT_MYA_M3}`}
                                        <br />
                                        {`${focusPolygon && focusPolygon.TS}`}
                                        <br />
                                        {`${focusPolygon && focusPolygon.DT}`}
                                    </div>
                                </div>
                            </InfoBox>
                        )}
                    </>
                }
                onPolygonComplete={onPolygonComplete}
            />
        </>
    );
};

export default MapPolygonComponent;
