import React from "react";
// import "./components.css";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteItem,
  selectItem,
  deleteInventory,
  updateItem,
} from "../actions/index.jsx";

export default function List() {
  const items = useSelector((state) => state.items);
  const dispatch = useDispatch();

  return (
    <>
      <div id="inventory-list">
        {items.map((item) => (
          <div key={item.id} className="item-card">
            <img className="card-image" src={item.image} alt={item.itemName} />
            <div className="card-container">
              <h3>{item.itemName}</h3>
              <div className="card-quantity">
                <button
                  type="button"
                  className="update-button"
                  onClick={() =>
                    dispatch(
                      updateItem({
                        id: item.id,
                        counter: -1,
                      })
                    )
                  }
                >
                  -
                </button>
                # {item.quantity}
                <button
                  type="button"
                  className="update-button"
                  onClick={() =>
                    dispatch(
                      updateItem({
                        id: item.id,
                        counter: 1,
                      })
                    )
                  }
                >
                  +
                </button>
              </div>
              <div className="card-quantity">
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => dispatch(selectItem(item))}
                >
                  View
                </button>
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => dispatch(deleteItem(item.id))}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        id="delete-all-btn"
        onClick={() => dispatch(deleteInventory())}
      >
        {" "}
        Delete All Items{" "}
      </button>
    </>
  );
}
