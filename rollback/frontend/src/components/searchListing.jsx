import React, {useEffect, useState} from "react";
import "../styles/listing.css";
import {getPosts} from "../redux/posts/service";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { useSelector, useDispatch } from "react-redux";
import { useMap } from "react-map-gl";


const ListingRight = () => {

  const visibleListing = useSelector((state) => state.displayListing);


  const [posts, setPosts] = useState([]);
  const [isBoxVisible, setIsBoxVisible] = useState(false);
  useEffect( () => {
    async function fetchData() {
      const response = await getPosts();
      setPosts(response);
    }
    fetchData();
  }, []);

  const [modalInfo, setModalInfo] = useState({
    postedBy: "",
    id: "",
    price: "",
    title: "",
    location: "",
    description: "",
  });

  const AccountInfo = {
    username: "username",
    logInId: "logInId",
    password: "password",
    address: "address",
    city: "city",
    state: "state",
    zip: "zip",
    phone: "phone",
    email: "email",
  };

  const {mymap} = useMap();
  const listing = visibleListing.map((listing) => {
    const item = listing.properties;
    return (
      <Card onMouseOver={() => {
        console.log(listing.geometry.coordinates);
        mymap.easeTo({
          center: [listing.geometry.coordinates[0], listing.geometry.coordinates[1]],
          
          duration: 500,
        });
      }
      } key={item.id} style={{ width: "12rem", margin: "10px" }}>
        <Card.Img variant="top" src={item.image || "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"} />
        <Card.Body>
          <Card.Title>{item.title}</Card.Title>
          {/* <Card.Text>
            <strong>{item.location}</strong> <br/>
            {item.description}
          </Card.Text> */}
          <Button
            variant="primary"
            onClick={() => {
              setIsBoxVisible(true);
              setModalInfo({
                id: item.id,
                image: item.image,
                title: item.title,
                price: item.price,
                postedBy: item.username,
                description: item.description,
              });
            }}
          >
            More Info
          </Button>
        </Card.Body>
      </Card>
    );
  });

  const ModalItem = () => {
    return (
      <Modal
        show={isBoxVisible}
        onHide={() => setIsBoxVisible(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        style={{ width: "100vw", position: "absolute" }}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <strong>
              {modalInfo.title} (#{modalInfo.id})
            </strong>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="moreinfo">
            <img
              src={modalInfo.image || "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
              alt="item"
              style={{ width: "50%", marginRight: "10px" }}
            />
            <div>
            <strong>Posted By:</strong> {modalInfo.postedBy}
              <br />
              <strong>Price: </strong> CA${modalInfo.price}
              <br />
              <strong>Description:</strong> {modalInfo.description}
              <br />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Form>
            <Form.Group>
              <Row>
                <Col>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Send a Message"
                  name="message"
                  style={{ width: "300px" }}
                />
                </Col>
                <Col>
                <Button variant="primary" type="submit">
                  Send
                </Button>
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <>
      <div className="createSearch">
        <div className="grow search">
          <h3>Listings</h3>
          <div className="box-content">
            <ModalItem />
            {listing}
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingRight;
