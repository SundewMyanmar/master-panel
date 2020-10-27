import React from 'react';
import MapComponent, { rawStyles } from '../google-map';
import MapPolygonComponent from '../google-map/MapPolygonComponent';
import { DEFAULT_CENTER } from '../google-map';
import DATA from '../google-map/yangon-boundaries-mimu-v9.2.1.json';

//TODO: multi select, selected area highlight

const VillageTractComponent = (props) => {
    var villageTracts = [];
    console.log('data', DATA.features);

    const modifyCoordinates = (coordinates) => {
        /**
         * x1, the lowest x coordinate
         * y1, the lowest y coordinate
         * x2, the highest x coordinate
         * y2, the highest y coordinate
         */
        var x1 = null,
            x2 = null,
            y1 = null,
            y2 = null;

        const data = coordinates[0].map((co) => {
            if (!x1) x1 = co[1];
            if (!x2) x2 = co[1];
            if (!y1) y1 = co[0];
            if (!y2) y2 = co[0];
            if (co[1] < x1) x1 = co[1];
            if (co[1] > x2) x2 = co[1];
            if (co[0] < y1) y1 = co[0];
            if (co[0] > y2) y2 = co[0];

            return {
                lng: co[0],
                lat: co[1],
            };
        });

        return {
            center: { lat: x1 + (x2 - x1) / 2, lng: y1 + (y2 - y1) / 2 },
            data: data,
        };
    };

    var polygonElements = DATA.features.map((dt) => {
        const coords = dt.geometry.coordinates[0];
        const mdfCoords = modifyCoordinates(coords);
        return {
            paths: mdfCoords.data,
            defaultCenter: mdfCoords.center,
            ...dt.properties,
        };
    });

    // console.log('poly', polygonElements, JSON.stringify(polygonElements));
    return (
        <>
            <MapPolygonComponent defaultCenter={DEFAULT_CENTER} defaultZoom={10} draggable={false} polygons={polygonElements} {...props} />
        </>
    );
};

export default VillageTractComponent;
