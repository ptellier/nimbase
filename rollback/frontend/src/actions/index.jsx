export const addItem = (item) => {
  return {
    type: "ADD_ITEM",
    payload: item,
  };
};

export const deleteItem = (itemId) => {
  return {
    type: "DELETE_ITEM",
    payload: itemId,
  };
};

export const selectItem = (item) => {
  return {
    type: "SELECT_ITEM",
    payload: item,
  };
};

export const closeDetails = () => {
  return {
    type: "CLOSE_DETAILS",
  };
};

export const deleteInventory = () => {
  return {
    type: "DELETE_INVENTORY",
  };
};

export const updateItem = (item) => {
  return {
    type: "UPDATE_ITEM",
    payload: item,
  };
};



export const setLocation = (location) => {
  return {
    type: "SET_LOCATION",
    payload: location,
  };
}

export const setVisibileListing = (listing) => {
  return {
    type: "SET_VISIBLE_LISTING",
    payload: listing,
  };
}

export const setListing = (listings) => {
  console.log(listings);
  return {
    type: "SET_LISTING",
    payload: listings,
  };
}

export const setVisibleListing = (listingIDs) => {
  return {
    type: "SET_VISIBLE_LISTING",
    payload: listingIDs,
  };
}