import React, { useState } from "react";
import "../styles/listing.css";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import { useSelector } from "react-redux";
import { useMap } from "react-map-gl";

const SearchListing = () => {
    const visibleListing = useSelector((state) => state.displayListing);
    const [isBoxVisible, setIsBoxVisible] = useState(false);

    const [modalInfo, setModalInfo] = useState({
        postedBy: "",
        id: "",
        price: "",
        title: "",
        location: "",
        description: "",
    });

    const { mymap } = useMap();
    const listing = visibleListing.map((listing) => {
        const item = listing.properties;
        return (
            <Card
                onMouseOver={() => {
                    console.log(listing.geometry.coordinates);
                    mymap.easeTo({
                        center: [
                            listing.geometry.coordinates[0],
                            listing.geometry.coordinates[1],
                        ],

                        duration: 500,
                    });
                }}
                key={item.id}
                style={{ width: "12rem", margin: "10px" }}
            >
                <Card.Img
                    variant="top"
                    src={
                        item.image ||
                        "https://www.apartments.com/images/librariesprovider2/blank-images/parkline-apartment-in-miami-flba486679-f59b-475d-885a-ae52659d1e51.jpg?sfvrsn=264e5d72_1"
                    }
                />
                <Card.Body>
                    <Card.Title>{item.title}</Card.Title>
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
                            src={
                                modalInfo.image ||
                                "https://www.apartments.com/images/librariesprovider2/blank-images/parkline-apartment-in-miami-flba486679-f59b-475d-885a-ae52659d1e51.jpg?sfvrsn=264e5d72_1"
                            }
                            alt="item"
                            style={{ width: "50%", marginRight: "10px" }}
                        />
                        <div>
                            <strong>Posted By:</strong> {modalInfo.postedBy}
                            <br />
                            <strong>Price: </strong> CA${modalInfo.price}
                            <br />
                            <strong>Description:</strong>{" "}
                            {modalInfo.description}
                            <br />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                    }}
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

export default SearchListing;
