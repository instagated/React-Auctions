import React, { Component } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { toast as toastConfig } from "../config.json";
import ToastService from "react-material-toast";
import Firebase from "../Firebase";

class SetApiKey extends Component {
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

class VerifyEmail extends Component {
  constructor(props) {
    super();
    this.state = {
      shown: props.shown,
    };
    this.toast = ToastService.new(toastConfig);
  }
  handleClose = () => {
    this.setState({ shown: false });
  };

  handleShow = () => {
    this.setState({ shown: true });
  };

  handleSubmit = () => {
    Firebase.auth().onAuthStateChanged((user) => {
      user
        .sendEmailVerification()
        .then(() => {
          this.toast.info("Die Bestätigungsemail wurde verschickt");
        })
        .catch((err) => {
          this.toast.warning("Die Bestätigungsemail konnte nicht verschickt werden");
          console.error(err);
        });
    });
    this.handleClose();
  };

  componentDidMount() {
    Firebase.auth().onAuthStateChanged((user) => {
      this.setState({ email: user.email });
    });
  }

  render() {
    const { shown, email } = this.state;
    return (
      <Modal show={shown} onHide={this.handleClose} backdrop="static" size="md" centered>
        <Modal.Header /*closeButton*/>
          <Modal.Title id="contained-modal-title-vcenter">E-Mail Verifizieren</Modal.Title>
        </Modal.Header>
        <Form onSubmit={this.handleSubmit}>
          <Modal.Body className="pb-0">
            <p>
              Möchtest du deine E-Mail Adresse <strong>{email}</strong> wirklich verifizieren?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="white" className="px-3 font-weight-bold" onClick={this.handleClose}>
              Abbrechen
            </Button>
            <Button variant="success" className="px-3 font-weight-bold" onClick={this.handleSubmit}>
              E-Mail verifizieren
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

export { SetApiKey, VerifyEmail };
