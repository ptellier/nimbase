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
