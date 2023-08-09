import { Marker } from "react-map-gl";
import Map from "react-map-gl";
import { Source, Layer } from "react-map-gl";
import { useState, useRef, useEffect } from "react";
import {
    clusterLayer,
    clusterCountLayer,
    unclusteredPointLayer,
    unclusteredCountLayer,
} from "./layers";
import "mapbox-gl/dist/mapbox-gl.css";
import { useSelector, useDispatch } from "react-redux";
import { setListing, setVisibleListing } from "../../actions/index";

export default function Maps() {
    const geojson = useSelector((state) => state.geojson);
    const dispatch = useDispatch();
    const mapRef = useRef(null);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [displayListing, setDisplayListing] = useState([]);
    navigator.geolocation.getCurrentPosition(function (position) {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
    });

    const onClick = (event) => {
        if (event.features.length === 0) {
            return;
        }
        const feature = event.features[0];
        const clusterId = feature.properties.cluster_id;
        const mapboxSource = mapRef.current.getSource("listings");
        if (feature.layer.id !== "unclustered-point") {
            mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
                if (err) {
                    return;
                }
                mapRef.current.easeTo({
                    center: feature.geometry.coordinates,
                    zoom,
                    duration: 500,
                });
            });
        } else {
            const unclusteredPointId = feature.properties.id;
            console.log(unclusteredPointId);
            const unclusteredPointcords = feature.geometry.coordinates;
            console.log(unclusteredPointcords);
            mapRef.current.easeTo({
                center: unclusteredPointcords,
                zoom: 15,
                duration: 500,
            });
        }
    };

    const onMapLoad = () => {
        mapRef.current.easeTo({
            center: [longitude, latitude],
            zoom: 10,
        });
    };

    function areArraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }
        const sortedArr1 = [...arr1].sort();
        const sortedArr2 = [...arr2].sort();
        for (let i = 0; i < sortedArr1.length; i++) {
            if (sortedArr1[i] !== sortedArr2[i]) {
                return false;
            }
        }
        return true;
    }

    const moveEnd = () => {
        const visibleFeatures = mapRef.current.queryRenderedFeatures({
            layers: ["unclustered-point"],
        });

        const visibleIds = visibleFeatures.map((f) => f.properties.id);
        const uniqueListing = visibleIds.filter(
            (v, i, a) => a.indexOf(v) === i
        );
        if (!areArraysEqual(displayListing, uniqueListing)) {
            setDisplayListing(uniqueListing);
            dispatch(setVisibleListing(uniqueListing));
            console.log(uniqueListing);
        }
    };

    useEffect(() => {
        async function getGeojson() {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_URL}/getlistings`
                );
                const data = await response.json();
                console.log(data);
                const structuredData = [];
                for (let i = 0; i < data.result.length; i++) {
                    structuredData.push({
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [
                                data.result[i].location[1],
                                data.result[i].location[0],
                            ],
                        },
                        properties: {
                            id: data.result[i]._id,
                            price: data.result[i].price,
                            description: data.result[i].description,
                            username: data.result[i].username,
                            title: data.result[i].title,
                        },
                    });
                }
                dispatch(setListing(structuredData));
            } catch (error) {
                console.log(error);
            }
        }
        getGeojson();
    }, []);

    return (
        <Map
            id="mymap"
            className="map"
            onLoad={onMapLoad}
            mapStyle="mapbox://styles/mapbox/streets-v10"
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            interactiveLayerIds={[clusterLayer.id, unclusteredPointLayer.id]}
            onClick={onClick}
            onMoveEnd={moveEnd}
            ref={mapRef}
        >
            <Source
                id="listings"
                type="geojson"
                data={geojson}
                cluster={true}
                clusterMaxZoom={14}
                clusterRadius={50}
            >
                <Layer {...clusterLayer} />
                <Layer {...clusterCountLayer} />
                <Layer {...unclusteredPointLayer} />
                <Layer {...unclusteredCountLayer} />
            </Source>
            <Marker longitude={longitude} latitude={latitude} color="red" />
        </Map>
    );
}
