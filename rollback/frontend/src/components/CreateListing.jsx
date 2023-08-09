import React, { useState } from "react";
import "../styles/listing.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import MapsCreate from "./mapCreate/maps";
import { MapProvider } from "react-map-gl";
import Pin from "./mapCreate/pin";
import { useMap } from "react-map-gl";
import axios from "axios";

export default function CreateListing() {
    const [isBoxVisible, setIsBoxVisible] = useState(false);

    const ModalForm = () => {
        const [center, setCenter] = useState(null);
        const { mymapcreate } = useMap();

        mymapcreate?.on("moveend", () => {
            setCenter(mymapcreate.getCenter());
        });

        const handleCreateSubmit = async (e) => {
            let form = {
                username: localStorage.getItem("username"),
                title: e.target.title.value,
                price: e.target.price.value,
                location: [center?.lat, center?.lng],
                description: e.target.description.value,
            };
            console.log(form);
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/create`,
                form,
                { withCredentials: true }
            );
            console.log(response);
        };

        return (
            <Form onSubmit={handleCreateSubmit} style={{ width: "100%" }}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>Location : </Form.Label>
                        {center?.lat + "," + center?.lng}
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
                        <strong>
                            Create Listing (User :{" "}
                            {localStorage.getItem("username")})
                        </strong>
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

    const a = () => {
        const val = ["\u0026#128512"];
        // convert above to emoji
        const emoji = val.map((x) => String.fromCodePoint(x));
    };
    
    return (
        <div>
            <ModalItem />
            <button
                onClick={() => setIsBoxVisible(true)}
                className="btn btn-primary"
                style={{ marginRight: "15px" }}
            >
                Create Listing
            </button>
        </div>
    );
}
