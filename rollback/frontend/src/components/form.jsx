import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../actions/index.jsx";

export default function Form() {
  const dispatch = useDispatch();
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const fileInput = useRef(null);

  const handleAddItem = () => {
    if (fileInput.current.files.length > 0) {
      let file = fileInput.current.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        let item = {
          itemName: itemName,
          description: description,
          price: price,
          image: reader.result,
          quantity: quantity ? quantity : 1,
        };

        console.log(item);
        dispatch(addItem(item));
        setItemName("");
        setDescription("");
        setPrice("");
        setQuantity("");
        fileInput.current.value = "";
        return;
      };
      return;
    }

    let base_url =
      "https://api.unsplash.com/search/photos/?client_id=kxmfK7moQMNBiXSRHvd4zT5sCDJKqyBgTuSJHC7V9Z4";
    const url = base_url + "&query=" + itemName;

    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();
    xhr.onload = function () {
      try {
        if (xhr.status === 200) {
          let data = JSON.parse(xhr.response);
          console.log(data);
          let img = data["results"][0]["urls"]["regular"];
          console.log(img);

          let item = {
            itemName: itemName,
            description: description,
            price: price,
            image: img,
            quantity: quantity ? quantity : 1,
          };
          console.log(item);
          dispatch(addItem(item));
          setItemName("");
          setDescription("");
          setPrice("");
          setQuantity("");
          fileInput.current.value = "";
        } else {
          console.log("Error Code is:" + xhr.status);
        }
      } catch (e) {
        console.log("Error Message:" + e);
      }
    };
  };

  const handleClearForm = () => {
    setItemName("");
    setDescription("");
    setPrice("");
    setQuantity("");
    fileInput.current.value = "";
  };

  return (
    <form id="item-form">
      <label htmlFor="item-name">Item Name:</label>
      <input
        id="item-name"
        name="item-name"
        type="text"
        placeholder="Item Name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
      />
      <label htmlFor="item-description">Description:</label>
      <input
        id="item-description"
        name="item-description"
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="form-cols">
        <div className="form-row">
          <label htmlFor="item-price">Price:</label>
          <input
            id="item-price"
            name="item-price"
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label htmlFor="item-price">Quantity:</label>
          <input
            id="item-price"
            name="item-price"
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label htmlFor="item-image">Image:</label>

          <input
            name="item-image"
            type="file"
            placeholder="Image"
            accept="image/*"
            ref={fileInput}
          />
        </div>
      </div>

      <button
        type="button"
        id="add-item"
        className="add-item"
        onClick={handleAddItem}
      >
        Add Item
      </button>
      <button type="button" id="clear-form" onClick={handleClearForm}>
        Clear
      </button>
    </form>
  );
}
