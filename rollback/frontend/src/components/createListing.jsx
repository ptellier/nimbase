import React, { useState } from "react";
import "../styles/listing.css";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import {addPost} from "../redux/posts/service"

const ListingLeft = () => {
  const [isBoxVisible, setIsBoxVisible] = useState(false);

  const [grow, setGrow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [radius, setRadius] = useState(0);
  const [location, setLocation] = useState("");

  const handleCreateSubmit = async (e) => {

    let form = {
      title: e.target.title.value,
      location: e.target.location.value,
      expirationDate: e.target.expirationDate.value,
      quantity: e.target.quantity.value,
      description: e.target.description.value,
    };
    console.log(form);
    await addPost(form).then(() => {
      // toast("👤 Account Updated!");
    }).catch((error) => {
      // toast("👤 ERR! Account NOT Updated!");
    });
  };

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

  const handleLocation = (e) => {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition((position) => {
      
    setLocation(position.coords.latitude + "," + position.coords.longitude);
    });
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
            <strong>Create Listing</strong>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" placeholder="Title" name="title" />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Location"
                  name="location"
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
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <>
      <div className="leftbar">
        <ModalItem />
        <div
          className={`${grow ? "grow" : ""} create`}
          onClick={() => setIsBoxVisible(true)}
        >
          <h3>Create Listing</h3>
        </div>
        <div
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
                    <Button variant="primary" onClick={handleLocation}>
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
            </div>
      </div>
    </>
  );
};

export default ListingLeft;
