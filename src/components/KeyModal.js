import React, { Component } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

export default class KeyModal extends Component {
  constructor(props) {
    super();
    this.state = {
      shown: props.shown,
      input: null,
    };
  }

  handleClose = () => {
    this.setState({ shown: false });
  };

  handleShow = () => {
    this.setState({ shown: true });
  };

  handleInput = (event) => {
    let val = event.target.value;
    this.setState({ input: val });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem("@dag_apiKey", this.state.input);
    this.handleClose();
  };

  render() {
    return (
      <Modal show={this.state.shown} onHide={this.handleClose} backdrop="static" size="md" centered>
        <Modal.Header /*closeButton*/>
          <Modal.Title id="contained-modal-title-vcenter">Einstellungen</Modal.Title>
        </Modal.Header>
        <Form onSubmit={this.handleSubmit}>
          <Modal.Body className="pb-0">
            <Form.Group as={Row} className="align-items-center">
              <Form.Label column sm={3}>
                <strong>API-Key</strong>
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  value={localStorage.getItem("@dag_apiKey")}
                  onChange={this.handleInput}
                />
              </Col>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className="px-3" onClick={this.handleClose}>
              Schließen
            </Button>
            <Button variant="success" className="px-3" type="submit">
              Speichern
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}
