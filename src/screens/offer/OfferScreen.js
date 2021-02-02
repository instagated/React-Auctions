import React, { Component } from "react";
import Firebase, { firestore } from "../../Firebase";
import Auction from "../../Auction";
import ReallifeRPG from "../../ReallifeRPG";
import { toast as toastConfig } from "../../config.json";
import ToastServive from "react-material-toast";
// Components
import { Col, Button, InputGroup, FormControl } from "react-bootstrap";
import Loader from "../../components/Loader";
import { DeleteOffer } from "../../components/Modals";
// Stylesheets
import "bootstrap/dist/css/bootstrap.min.css";
import "./OfferScreen.scss";
import { Redirect } from "react-router-dom";

export default class OfferScreen extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      offerId: window.location.href.split("/")[4],
      deleteModal: false,
    };
    this.toast = ToastServive.new(toastConfig);
  }

  _renderProductImage = (image) => {
    return (
      <a className="image" onClick={() => this.setState({ thumbnail: image })} key={image}>
        <img src={image} alt="Produktbild" />
      </a>
    );
  };
  buy(offer, user) {
    new ReallifeRPG().getPlayer(localStorage.getItem("@dag_apiKey")).then((player) => {
      const playerData = player.data[0],
        pid = playerData.pid,
        cash = parseInt(playerData.cash),
        bank = parseInt(playerData.bankacc),
        total = cash + bank;

      if (this.checkBalance(offer.price, total)) {
        new Auction()
          .buy(user.uid, pid, offer.id)
          .then((res) => {
            this.toast.success(`Du hast den Artikel ${offer.name} gekauft`);
          })
          .catch((err) => {
            console.error("[Auctions]", err);
            this.toast.error("Etwas ist schief gelaufen");
          });
      } else {
        this.toast.error("Du hast nicht ausreichend Geld für dieses Angebot");
      }
    });
  }

  checkBalance(requiredBalance, totalBalance) {
    return totalBalance >= requiredBalance;
  }

  componentDidMount() {
    const { offerId } = this.state;

    // Check if the user is signed in via Firebase
    Firebase.auth().onAuthStateChanged((user) => {
      user
        ? this.setState({ authentificated: true, user: user })
        : this.setState({ authentificated: false });
    });

    // Get real-time document changes & update the state
    firestore
      .collection("offers")
      .doc(offerId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          let offer = doc.data();
          offer.id = offerId;

          offer.bought === undefined
            ? this.setState({
                countdown: new Auction().createCountdown(offer.expiresAt.seconds),
              })
            : this.setState({ countdown: "Das Angebot wurde verkauft" });

          setInterval(() => {
            offer.bought === undefined
              ? this.setState({
                  countdown: new Auction().createCountdown(offer.expiresAt.seconds),
                })
              : this.setState({ countdown: "Das Angebot wurde verkauft" });
          }, 1000);

          offer.seller.get().then((user) => {
            this.setState({
              found: true,
              offer: offer,
              seller: user,
              thumbnail: offer.images.thumbnail,
              loading: false,
            });
          });
        } else {
          this.setState({ loading: false, found: false });
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
                      {this._renderProductImage(offer.images.thumbnail)}
                      {offer.images.product !== null
                        ? offer.images.product.map((image) => {
                            return this._renderProductImage(image);
                          })
                        : null}
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
                      {authentificated && user.uid !== seller.id && offer.bought === undefined ? (
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
                          <Button
                            className="w-100"
                            variant="success"
                            onClick={() => {
                              this.buy(offer, user);
                            }}
                          >
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
        return <Redirect to="../" />;
      }
    }
  }
}
