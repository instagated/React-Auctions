import React, { Component } from "react";
import { toast as toastConfig } from "../config.json";
import ToastService from "react-material-toast";
import Firebase, { firestore } from "../Firebase";
import Auction from "../Auction";
// Components
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";

class CreateOffer extends Component {
  constructor(props) {
    super();
    this.state = {
      loading: false,
      shown: props.shown,
    };
    this.toast = ToastService.new(toastConfig);
  }

  handleClose = () => this.setState({ shown: false });

  handleShow = () => this.setState({ shown: true });

  handleSubmit = (e) => {
    this.setState({ loading: true });
    e.preventDefault();

    let {
      type,
      thumbnail,
      images,
      title,
      price,
      description,
      expireDate,
      expireTime,
    } = e.target.elements;

    let newOffer = {
      type: parseInt(type.value),
      name: title.value,
      description: description.value,
      price: parseFloat(price.value),
      seller: firestore.doc("user/" + Firebase.auth().currentUser.uid),
      expiresAt: new Date(`${expireDate.value} ${expireTime.value}`),
      createdAt: new Date(),
    };
    new Auction()
      .createOffer(newOffer, thumbnail.files[0], images.files)
      .then(() => {
        this.handleClose();
        this.toast.success(`Das Angebot ${newOffer.name} wurde erstellt`);
        this.formRef.reset();
        this.setState({ loading: false });
      })
      .catch((err) => {
        console.error(err);
        this.handleClose();
        this.toast.error("Das Angebot konnte nicht erstellt werden");
        this.formRef.reset();
        this.setState({ loading: false });
      });
  };

  render() {
    const { loading } = this.state;

    return (
      <Modal show={this.state.shown} onHide={this.handleClose} backdrop="static" size="md" centered>
        <Modal.Header /*closeButton*/>
          <Modal.Title id="contained-modal-title-vcenter">Angebot erstellen</Modal.Title>
        </Modal.Header>
        <Form onSubmit={this.handleSubmit} ref={(target) => (this.formRef = target)}>
          <Modal.Body className="pb-0">
            <div className={loading ? "spinner-container" : "d-none"}>
              <Spinner className="loader" animation="border" />
            </div>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>
                <strong>Typ</strong>
              </Form.Label>
              <Form.Control as="select" name="type">
                {/* <option value="1">Auktion</option> */}
                <option value="2">Sofortkauf</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="align-items-center">
              <Form.Label>
                <strong>Vorschaubild</strong>
              </Form.Label>
              <Form.File
                name="thumbnail"
                label="Datei"
                data-browse="Datei suchen"
                custom
                required
              />
            </Form.Group>
            <Form.Group className="align-items-center">
              <Form.Label>
                <strong>Produktbilder</strong>
              </Form.Label>
              <Form.File name="images" label="Datei" data-browse="Datei suchen" custom multiple />
            </Form.Group>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
              <Col lg={6} className="px-0 pr-md-3">
                <Form.Group className="align-items-center">
                  <Form.Label>
                    <strong>Artikel</strong>
                  </Form.Label>
                  <Form.Control type="text" name="title" required />
                </Form.Group>
              </Col>

              <Col lg={6} className="px-0">
                <Form.Group className="align-items-center">
                  <Form.Label>
                    <strong>Preis</strong>
                  </Form.Label>
                  <Form.Control type="number" pattern="numeric" name="price" required />
                </Form.Group>
              </Col>
            </div>
            <Form.Group className="align-items-center">
              <Form.Label>
                <strong>Beschreibung</strong>
              </Form.Label>
              <Form.Control as="textarea" rows={3} name="description" required />
            </Form.Group>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
              <Col lg={6} className="px-0 pr-md-3">
                <Form.Group className="align-items-center">
                  <Form.Label>
                    <strong>Enddatum</strong>
                  </Form.Label>
                  <Form.Control type="date" name="expireDate" required />
                </Form.Group>
              </Col>

              <Col lg={6} className="px-0">
                <Form.Group className="align-items-center">
                  <Form.Label>
                    <strong>Enddatum</strong>
                  </Form.Label>
                  <Form.Control type="time" name="expireTime" required />
                </Form.Group>
              </Col>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="white" className="px-3" onClick={this.handleClose}>
              Abbrechen
            </Button>
            <Button variant="success" className="px-3" type="submit" disabled={loading}>
              Angebot erstellen
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

class DeleteOffer extends Component {
  constructor(props) {
    super();
    this.state = {
      shown: props.shown,
      offer: props.offer,
    };
    this.toast = ToastService.new(toastConfig);
  }

  handleClose = () => {
    this.setState({ shown: false });
  };

  handleShow = () => {
    this.setState({ shown: true });
  };

  toggleShow = () => {
    const { shown } = this.state;
    this.setState({ shown: !shown });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { offer } = this.state;
    new Auction()
      .deleteOffer(offer)
      .then((result) => {
        console.log(result);
        this.toast.success("Das Angebot wurde gelöscht");
        // TODO Redirect to the landingpage
      })
      .catch((err) => {
        console.error(err);
        this.toast.error("Das Angebot konnte nicht gelöscht werden");
      });
    this.handleClose();
  };

  render() {
    const { offerName } = this.props;

    return (
      <Modal show={this.state.shown} onHide={this.handleClose} backdrop="static" size="md" centered>
        <Modal.Header /*closeButton*/>
          <Modal.Title id="contained-modal-title-vcenter">Angebot löschen</Modal.Title>
        </Modal.Header>
        <Form onSubmit={this.handleSubmit}>
          <Modal.Body className="pb-0">
            <p>
              Wollen Sie das Angebot <strong>{offerName}</strong> wirklich löschen? Dieser Vorgang
              kann nicht rückgängig gemacht werden!
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="white" className="px-3" onClick={this.handleClose}>
              Abbrechen
            </Button>
            <Button variant="success" className="px-3" type="submit">
              Angebot löschen
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

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
            <Button variant="white" className="px-3" onClick={this.handleClose}>
              Abbrechen
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

export { CreateOffer, DeleteOffer, SetApiKey, VerifyEmail };
