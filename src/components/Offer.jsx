import React, { Component } from "react";
import { toast as toastConfig } from "../config.json";
import ToastService from "react-material-toast";
import Firebase from "../Firebase";
import { Offer as OfferAPI } from "../ApiHandler";
// Components
import { Card, Badge, Modal, Button, Form, Col, Spinner } from "react-bootstrap";
// StyleSheets
import "../style/card.scss";

class Offer extends Component {
  render() {
    const { deletable, thumbnail, type, name, description, price } = this.props;
    return (
      <div>
        <Card className="offer">
          <Card.Img variant="top" src={thumbnail} />
          <Badge className="badge" variant="success">
            {type === 1 ? "Auktion" : "Sofortkauf"}
          </Badge>
          {deletable && (
            <Button
              variant="danger"
              size="sm"
              className="remove-btn px-3"
              onClick={() => {
                // There is no onClick required bcause the offer can only get deleted @ the OfferScreen
              }}
            >
              Löschen
            </Button>
          )}
          <Card.Body>
            <Card.Title className="font-weight-bold mb-0">{name}</Card.Title>
            <Card.Text className="text-truncate mb-0">{description}</Card.Text>
            <Card.Text className="font-weight-bold">
              {type === 1
                ? `Gebot: ${price.toLocaleString(undefined)} €`
                : `Preis: ${price.toLocaleString(undefined)} €`}
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

class CreateOfferModal extends Component {
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

  handleSubmit = (event) => {
    this.setState({ loading: true });
    event.preventDefault();

    const {
      type,
      thumbnail,
      images,
      title,
      price,
      description,
      expireDate,
      expireTime,
    } = event.target.elements;

    const newOffer = {
      type: parseInt(type.value),
      name: title.value,
      description: description.value,
      price: parseFloat(price.value),
      seller: Firebase.auth().currentUser.uid,
      expiresAt: new Date(`${expireDate.value} ${expireTime.value}`),
      createdAt: new Date(),
    };

    new OfferAPI()
      .create(newOffer, thumbnail.files[0], images.files)
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
                <option value="1">Auktion</option>
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

class DeleteOfferModal extends Component {
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
    new OfferAPI()
      .delete(offer)
      .then((result) => {
        console.log(result);
        this.toast.success("Das Angebot wurde gelöscht");
      })
      .catch((err) => {
        console.error(err);
        this.toast.error(err.message);
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

export { Offer, CreateOfferModal, DeleteOfferModal };
