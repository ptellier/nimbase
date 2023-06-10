import React from "react";
// import "./components.css";
import { useSelector } from "react-redux";

export default function List() {
  const items = useSelector((state) => state.items);
  const total = items.reduce(
    (total, item) => total + parseInt(item.quantity),
    0
  );
  const totalValue = items.reduce(
    (total, item) => total + parseFloat(item.price) * parseInt(item.quantity),
    0
  );
  return (
    <div className="stat">
      <h3>Stat for nerds</h3>
      <div className="stats">Total items : {total}</div>
      <div className="stats">Total value of inventory : {totalValue}</div>
    </div>
  );
}
