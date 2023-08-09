
const initialState = {
  items: [],
  selectedItem: null,
  map: {
    latitude: 0,
    longitude: 0,
    zoom: 1
  },
  displayListing: [],
  user: "",
  geojson : {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [0,0] },
          properties: {
              id: "",
              price: 0,
              description: "",
              username: "",
              title: "",
          }
      }
    ],
  }
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_LOCATION":
      return {
        ...state,
        map: action.payload,
      };
    case "SET_VISIBLE_LISTING":
      const visibleListing = state.geojson.features.filter((item) => {
        return action.payload.includes(item.properties.id);
      });

      return {
        ...state,
        displayListing: visibleListing,
      };
    case "SET_LISTING":
      console.log(action.payload);
      return {
        ...state,
        geojson: {
          ...state.geojson,
          features: action.payload,
        }
      };
    default:
      return state;
  }
};

export default rootReducer;
