import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeDetails } from "../actions/index.jsx";

export default function Item() {
  const dispatch = useDispatch();
  const selectedItem = useSelector((state) => state.selectedItem);

  if (!selectedItem) {
    return null;
  }

  return (
    <div className="modal active">
      <div className="modal-content">
        <span className="close" onClick={() => dispatch(closeDetails())}>
          &times;
        </span>
        <div className="half">
          <img
            className="modal-image"
            src={selectedItem.image}
            alt={selectedItem.itemName}
          />
        </div>
        <div className="half">
          <h2>{selectedItem.itemName}</h2>
          <p>Description : {selectedItem.description}</p>
          <p>Price: ${selectedItem.price}</p>
          <p>Quantity: {selectedItem.quantity}</p>
        </div>
      </div>
    </div>
  );
}
