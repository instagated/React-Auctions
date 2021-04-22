import React, { Component } from "react";
import Firebase, { firestore } from "../../Firebase";
import { User, Offer, Auction } from "../../ApiHandler";
import { toast as toastConfig } from "../../config.json";
import ToastServive from "react-material-toast";
// Components
import { Col, Button, InputGroup, FormControl } from "react-bootstrap";
import Loader from "../../components/Loader";
import { DeleteOfferModal } from "../../components/Offer";
import { Redirect } from "react-router-dom";
// Stylesheets
import "bootstrap/dist/css/bootstrap.min.css";
import "./OfferScreen.scss";

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

  /**
   * Update the Firestore documents & fire an toast
   * @param {object} offer
   * @param {object} user
   */
  handleBuy(offer, user) {
    new Offer()
      .buy(offer.id, user.uid)
      .then((result) => {
        this.toast.success("Du hast den Artikel gekuaft");
      })
      .catch((err) => {
        console.error("ERROR:", err);
        this.toast.error("Etwas ist schief gelaufen");
      });
  }

  /**
   * Update the Firestore documents & fire an toast
   * @param {object} offer
   * @param {object} user
   * @param {number} bid
   */
  handleBid(offer, user, bid) {
    new Auction()
      .bid(offer.id, { id: user.uid, username: user.displayName }, bid)
      .then((result) => {
        // console.log(result);
        this.toast.success("Dein Gebot wurde eingereicht");
      })
      .catch((err) => {
        this.toast.error("Das Gebot konnte nicht eingereicht werden");
        console.error("ERROR:", err);
      });
  }

  componentDidMount() {
    const { offerId } = this.state;
    // Check if the user is signed in via Firebase
    Firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ authentificated: true, user: user });
      } else {
        this.setState({ authentificated: false });
      }
    });

    // Get real-time document changes & update the state
    firestore
      .collection("offers")
      .doc(offerId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const offer = doc.data();
          var gotBought = offer.bought !== undefined;
          offer.id = offerId;

          // FIXME Fix the countdown after the the document got updated
          if (!gotBought) {
            this.setState({
              countdown: new Offer().createCountdown(offer.expiresAt.seconds),
            });
          } else {
            this.setState({ countdown: "Das Angebot wurde verkauft" });
          }

          setInterval(() => {
            if (!gotBought) {
              this.setState({
                countdown: new Offer().createCountdown(offer.expiresAt.seconds),
              });
            } else {
              this.setState({ countdown: "Das Angebot wurde verkauft" });
            }
          }, 1000);

          firestore
            .collection("user")
            .doc(offer.seller)
            .get()
            .then((user) => {
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
    const {
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

    const ProductImage = (props) => {
      const { image } = props;
      return (
        <a className="image" onClick={() => this.setState({ thumbnail: image })} key={image}>
          <img src={image} alt="Produktbild" />
        </a>
      );
    };

    if (loading) {
      return <Loader />;
    } else {
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
                      <ProductImage image={offer.images.thumbnail} />
                      {offer.images.product !== null &&
                        offer.images.product.map((image) => {
                          return <ProductImage image={image} />;
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
                          src={new User().getAvatar(seller.data().username)}
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

                    {authentificated && user.uid === seller.id && (
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
                    )}

                    <div className="bg-light rounded p-3">
                      <h3 className="font-weight-bold">{offer.name}</h3>
                      <h5 className="font-weight-bold">
                        {offer.price.toLocaleString(undefined)} €
                      </h5>
                      <p className="mb-0">{countdown}</p>
                      {authentificated &&
                        user.uid !== seller.id &&
                        offer.bought === undefined &&
                        (offer.type === 1 ? (
                          <form
                            ref={(target) => (this.formRef = target)}
                            onSubmit={(event) => {
                              event.preventDefault();
                              const { bid } = event.target.elements;
                              this.handleBid(offer, user, parseInt(bid.value));
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
                                // FIXME Check if there is already an bid on this article. If not we're gonna use the current price from the database
                                // If there is already an bid the user have to add another dollar to overbid the current bid
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
                              this.handleBuy(offer, user);
                            }}
                          >
                            Kaufen
                          </Button>
                        ))}
                      <p className="font-weight-bold mb-0">Beschreibung</p>
                      <p className="mb-0">{offer.description}</p>
                    </div>
                  </aside>
                </Col>
              </div>
            </div>
            <DeleteOfferModal
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
