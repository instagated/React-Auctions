import React, { Component } from "react";
import { toast as toastConfig } from "../config.json";
import ToastService from "react-material-toast";
import Firebase from "../Firebase";
// Components
import { Modal, Button, Form } from "react-bootstrap";

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
            <Button variant="white" className="px-3" onClick={this.handleClose}>
              Abbrechen
            </Button>
            <Button variant="success" className="px-3" onClick={this.handleSubmit}>
              E-Mail verifizieren
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

export { VerifyEmail };
