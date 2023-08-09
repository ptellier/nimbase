import "../../styles/listing.css";

import * as React from "react";
import { useState } from "react";
import { useRef } from "react";
import Map from "react-map-gl";
import GeocoderControl from "./geocoder-control";

export default function MapsCreate() {
    const mapRef = useRef(null);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    navigator.geolocation.getCurrentPosition(function (position) {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
    });

    const onMapLoad = () => {
        console.log(mapRef.current);
        mapRef.current.easeTo({
            center: [longitude, latitude],
            zoom: 15,
        });
    };

    return (
        <Map
            id="mymapcreate"
            className="map"
            onLoad={onMapLoad}
            mapStyle="mapbox://styles/mapbox/streets-v10"
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            ref={mapRef}
        >
            <GeocoderControl
                mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                position="top-left"
            />
        </Map>
    );
}
