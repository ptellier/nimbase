import React, { useState } from "react";
import "../styles/listing.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import { addPost } from "../redux/posts/service";

import MapsCreate from "./mapCreate/maps";
import { MapProvider } from "react-map-gl";
import Pin from "./mapCreate/pin";
import { useMap } from "react-map-gl";
import { useSelector } from "react-redux";
import axios from "axios";


const ListingLeft = () => {
  const username = useSelector((state) => state.user);
  const [isBoxVisible, setIsBoxVisible] = useState(false);
  const [grow, setGrow] = useState(false);
  const [radius, setRadius] = useState(0);
  const [location, setLocation] = useState("");
  
  const { mymapcreate } = useMap();
  const [createListinglocation, setCreateListingLocation] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  navigator.geolocation.getCurrentPosition(function (position) {
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
  });


  

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    let form = {
      keyword: e.target.keyword.value,
      location: e.target.location.value,
      radius: e.target.radius.value,
      quantity: e.target.quantity.value,
      expirationDate: e.target.expirationDate.value,
    };
    console.log(form);
  };

  
  
  const ModalForm = () => {
    const [center, setCenter] = useState(null);
    const { mymapcreate } = useMap();
  
    mymapcreate?.on("moveend", () => {
      setCenter(mymapcreate.getCenter());
      // console.log(mymapcreate.getCenter());
    });
    
    const handleCreateSubmit = async (e) => {
      // e.preventDefault();
      let form = {
        username: localStorage.getItem("username"),
        title: e.target.title.value,
        price: e.target.price.value,
        location: [center?.lat, center?.lng],
        description: e.target.description.value,
      };
      console.log(form);
      const response = await axios.post("http://localhost:8080/create", form, { withCredentials: true});
      console.log(response);
    
    };
    

    return (
      <Form onSubmit={handleCreateSubmit} style={{ width: "100%" }}>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Location : </Form.Label>
                  {center?.lat+','+center?.lng}
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridPassword">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Title"
                    name="title"
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridPassword">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Price"
                    name="price"
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={8}
                    placeholder="Description"
                    name="description"
                  />
                </Form.Group>
              </Row>
              <Modal.Footer>
                <Button type="submit">Create Listing</Button>
              </Modal.Footer>
            </Form>
    );
  };

  const ModalItem = () => {
    return (
      <Modal
        show={isBoxVisible}
        onHide={() => setIsBoxVisible(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <strong>Create Listing (User : {localStorage.getItem("username")})</strong>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-container">
        <MapProvider>
          <div className="half">
            <MapsCreate />
            <Pin size={30} />
          </div>
          <div className="half">
            <ModalForm />
          </div>
        </MapProvider>
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <div className="leftbar">
        <ModalItem />
      <div
        className={`${grow ? "grow" : ""} create`}
        onClick={() => setIsBoxVisible(true)}
      >
        <h3>Create Listing</h3>
      </div>
      {/* <div
        className={`${grow ? "" : "grow"} search`}
        onClick={() => setGrow(false)}
      >
        <h3>Search</h3>
        <div className={`${grow ? "hidden" : "box"}`}>
          <div className="box-close" onClick={() => setGrow(!grow)}>
            <Form onSubmit={handleSearchSubmit}>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Keyword</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Vancouver, Calgary, etc."
                    name="keyword"
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridPassword">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Location"
                    name="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </Form.Group>
              </Row>
              <Button variant="primary" onClick={handleCreateLocation}>
                Set Current Location
              </Button>
              <br />
              <br />

              <Form.Label>Radius {radius} km</Form.Label>
              <Form.Range
                defaultValue={0}
                onChange={(e) => setRadius(e.target.value)}
                max={50}
                name="radius"
              />
              <Row style={{ margin: "20px" }}>
                <Button variant="primary" type="submit">
                  Search
                </Button>
              </Row>
            </Form>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ListingLeft;
