import React, { Component } from "react";
import { Col, Button, InputGroup, FormControl } from "react-bootstrap";
import Loader from "../../components/Loader";
import Firebase, { firestore } from "../../Firebase";
import { DeleteOffer } from "../../components/Modals";
import "bootstrap/dist/css/bootstrap.min.css";
import "./OfferScreen.scss";
import Auction from "../../Auction";

export default class OfferScreen extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      offerId: window.location.href.split("/")[4],
      deleteModal: false,
    };

    // Check if the user is signed in via Firebase
    Firebase.auth().onAuthStateChanged((user) => {
      user
        ? this.setState({ authentificated: true, user: user })
        : this.setState({ authentificated: false });
    });
  }

  componentDidMount() {
    let { offerId } = this.state,
      temp = [];

    // Get the offer from the database
    firestore
      .collection("offers")
      .doc(offerId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          let offer = doc.data();
          offer.id = offerId;

          this.setState({ countdown: new Auction().createCountdown(offer.expiresAt.seconds) });
          setInterval(() => {
            this.setState({ countdown: new Auction().createCountdown(offer.expiresAt.seconds) });
          }, 1000);

          temp.push(offer);
          offer.seller.get().then((user) => {
            temp.push(user);
            this.setState({
              found: true,
              offer: temp[0],
              seller: temp[1],
              thumbnail: temp[0].images.thumbnail,
              loading: false,
            });
          });
        } else {
          this.setState({ loading: false, found: false });
        }
      });

    // Get real-tiem document changes & update the state
    firestore
      .collection("offers")
      .doc(offerId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          let offer = doc.data();
          offer.id = offerId;
          this.setState({ offer: offer });
        }
      });
  }

  render() {
    let {
      loading,
      found,
      authentificated,
      user,
      offerId,
      offer,
      seller,
      thumbnail,
      countdown,
      deleteModal,
    } = this.state;

    if (loading) {
      return <Loader />;
    } else {
      // FIXME Get the avatar from the instead of using the DulliAG logo
      if (found) {
        return (
          <section className="offer">
            <div>
              <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                <Col className="px-0 px-md-3" xs={12} md={8} lg={8}>
                  <main>
                    <div className="w-100 mb-3">
                      <img className="thumbnail" src={thumbnail} alt="Vorschaubild" />
                    </div>
                    <div className="image-container mb-3">
                      <a
                        className="image"
                        onClick={() => this.setState({ thumbnail: offer.images.thumbnail })}
                      >
                        <img src={offer.images.thumbnail} alt="Vorschaubild" />
                      </a>
                      {offer.images.product.map((image, index) => {
                        return (
                          <a
                            className="image"
                            onClick={() => this.setState({ thumbnail: image })}
                            key={index}
                          >
                            <img src={image} alt="Produktbild" />
                          </a>
                        );
                      })}
                    </div>
                  </main>
                </Col>
                <Col className="px-0 px-md-3" xs={12} md={4} lg={4}>
                  <aside>
                    <div className="d-flex bg-light rounded mb-3 p-3">
                      <p className="font-weight-bold mb-0">
                        <img
                          style={{ width: "2.5rem", height: "auto", marginRight: 3 }}
                          className="rounded-circle shadow-md"
                          src={"https://files.dulliag.de/web/images/logo.jpg"}
                          alt="Profilbild"
                        />{" "}
                        {seller.data().username}
                      </p>
                      <Button
                        className="ml-auto rounded px-3"
                        variant="success"
                        size="sm"
                        disabled={true}
                      >
                        Kontaktieren
                      </Button>
                    </div>

                    {authentificated && user.uid === seller.id ? (
                      <div className="bg-light rounded mb-3 p-3">
                        <Button
                          variant="danger"
                          className="w-100"
                          onClick={() => {
                            this.deleteModal.toggleShow();
                          }}
                        >
                          Angebot löschen
                        </Button>
                      </div>
                    ) : null}

                    <div className="bg-light rounded p-3">
                      <h3 className="font-weight-bold">{offer.name}</h3>
                      <h5 className="font-weight-bold">
                        {offer.price.toLocaleString(undefined)} €
                      </h5>
                      <p className="mb-0">{countdown}</p>
                      {authentificated && user.uid !== seller.id ? (
                        offer.type === 1 ? (
                          <form
                            ref={(target) => (this.formRef = target)}
                            onSubmit={(event) => {
                              event.preventDefault();
                              const { bid } = event.target.elements;
                              // TODO Push an string with the current winner of the auction
                              firestore
                                .collection("offers")
                                .doc(offer.id)
                                .update({
                                  price: parseInt(bid.value),
                                });
                              this.formRef.reset();
                            }}
                          >
                            <InputGroup className="mb-2">
                              <FormControl
                                type="number"
                                pattern="numeric"
                                min={offer.price + 1}
                                id="bid"
                                className="bg-light"
                                placeholder={
                                  "Min. " + (offer.price + 1).toLocaleString(undefined) + " €"
                                }
                                style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }}
                              />
                              <InputGroup.Append>
                                <Button
                                  type="submit"
                                  variant="success"
                                  className="px-3"
                                  style={{ borderTopRightRadius: 5, borderBottomRightRadius: 5 }}
                                  onClick={() => {
                                    // TODO Push the uid from the current user to the offer & set expiresAt to 0
                                  }}
                                >
                                  Bieten
                                </Button>
                              </InputGroup.Append>
                            </InputGroup>
                          </form>
                        ) : (
                          <Button className="w-100" variant="success" style={{ borderRadius: 5 }}>
                            Kaufen
                          </Button>
                        )
                      ) : null}
                      <p className="font-weight-bold mb-0">Beschreibung</p>
                      <p className="mb-0">{offer.description}</p>
                    </div>
                  </aside>
                </Col>
              </div>
            </div>
            <DeleteOffer
              shown={deleteModal}
              offer={offerId}
              offerName={offer.name}
              ref={(target) => (this.deleteModal = target)}
            />
          </section>
        );
      } else {
        return (
          <section>
            <div>
              <div className="bg-light mx-auto px-4 py-3 rounded">
                <h3 className="font-weight-bold text-center mb-0">
                  Das Angebot <i>{offerId}</i> wurde nicht gefunden
                </h3>
              </div>
            </div>
          </section>
        );
      }
    }
  }
}
