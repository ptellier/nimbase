export const clusterLayer = {
    id: "clusters",
    type: "circle",
    source: "listings",
    filter: ["has", "point_count"],
    paint: {
        "circle-color": "#000000",
        "circle-radius": 30,
        "circle-stroke-color": "lightblue",
        "circle-stroke-width": 2,
    },
};

export const clusterCountLayer = {
    id: "cluster-count",
    type: "symbol",
    source: "listings",
    filter: ["has", "point_count"],
    layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 15,
    },
    paint: {
        "text-color": "#ffffff",
    },
};

export const unclusteredCountLayer = {
    id: "unclustered-count",
    type: "symbol",
    source: "listings",
    filter: ["!", ["has", "point_count"]],
    paint: {
        "text-color": "black",
    },
    layout: {
        "text-field": "${price}",
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
    },
};

export const unclusteredPointLayer = {
    id: "unclustered-point",
    type: "circle",
    source: "listings",
    filter: ["!", ["has", "point_count"]],
    paint: {
        "circle-color": "white",
        "circle-radius": 25,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#000000",
        "circle-opacity": 0.8,
    },
};
