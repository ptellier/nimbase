
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
    case "ADD_ITEM":
      return {
        ...state,
        items: [
          ...state.items,
          { ...action.payload, id: state.items.length + 1 },
        ],
      };

    case "DELETE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case "SELECT_ITEM":
      return {
        ...state,
        selectedItem: action.payload,
      };
    case "CLOSE_DETAILS":
      return {
        ...state,
        selectedItem: null,
      };
    case "DELETE_INVENTORY":
      return {
        ...state,
        items: [],
      };
    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((item) => {
          if (item.id === action.payload.id) {
            console.log(
              parseInt(item.quantity) + parseInt(action.payload.counter)
            );
            return {
              ...item,
              quantity:
                parseInt(item.quantity) + parseInt(action.payload.counter),
            };
          }
          return item;
        }),
      };
    case "SET_LOCATION":
      return {
        ...state,
        map: action.payload,
      };
    case "SET_VISIBLE_LISTING":
      // action.payload is a list of ids
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
