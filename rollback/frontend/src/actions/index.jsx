export const setLocation = (location) => {
  return {
    type: "SET_LOCATION",
    payload: location,
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