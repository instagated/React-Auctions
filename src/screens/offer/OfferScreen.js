import React, { Component } from "react";
import { Col, Row, Button, InputGroup, FormControl } from "react-bootstrap";
import Auction from "../../Auction";
import Loader from "../../components/Loader";
import "bootstrap/dist/css/bootstrap.min.css";
import "./OfferScreen.scss";

export default class OfferScreen extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      offerId: window.location.href.split("/")[4],
      offer: null,
      thumbnail: null,
      seller: null,
      countdown: null,
    };
  }

  componentDidMount() {
    new Auction().getOffer(this.state.offerId).then((offer) => {
      new Auction().getSeller(offer.seller).then((seller) => {
        let user = seller;
        user.seller = offer.seller;
        user.avatar = new Auction().getAvatar(seller.username);
        this.setState({
          offer: offer,
          thumbnail: offer.images.thumbnail,
          seller: seller,
          loading: false,
        });

        let countdown = setInterval(() => {
          let now = Date.now() / 1000,
            expiresAt = offer.expiresAt,
            diff = expiresAt - now;
          if (diff > 0) {
            var d = Math.floor(diff / 86400),
              h = Math.floor((diff - d * 86400) / 3600),
              h = h < 10 ? `0${h}` : h,
              m = Math.floor((diff - d * 86400 - h * 3600) / 60),
              m = m < 10 ? `0${m}` : m,
              s = Math.floor(diff - d * 86400 - h * 3600 - m * 60),
              s = s < 10 ? `0${s}` : s;
            if (d !== 0) {
              d > 1
                ? this.setState({ countdown: `Verbleibende Zeit: ${d} Tage & ${h}:${m}:${s}` })
                : this.setState({ countdown: `Verbleibende Zeit: ${d} Tag & ${h}:${m}:${s}` });
            } else {
              this.setState({ countdown: `Verbleibende Zeit: ${h}:${m}:${s}` });
            }
          } else {
            clearInterval(countdown);
            this.setState({ countdown: "Das Angebot ist nicht mehr verfügbar" });
          }
        }, 1000);
      });
    });
  }

  render() {
    if (this.state.loading === true) {
      return <Loader />;
    } else {
      let offer = this.state.offer;
      return (
        <section className="offer">
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              <Col className="px-0 px-md-3" xs={12} md={8} ld={8}>
                <main>
                  <div className="w-100 mb-3">
                    <img className="thumbnail" src={this.state.thumbnail} alt="Produktbild" />
                  </div>
                  <div className="image-container mb-3">
                    <a
                      className="image"
                      onClick={() => {
                        this.setState({ thumbnail: offer.images.thumbnail });
                      }}
                    >
                      <img src={offer.images.thumbnail} alt="Produktbild" />
                    </a>
                    {offer.images.product.map((image, index) => {
                      return (
                        <a
                          className="image"
                          onClick={() => {
                            this.setState({ thumbnail: image });
                          }}
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
                  <div className="d-flex bg-light mb-3 p-3" style={{ borderRadius: 12 }}>
                    <p className="font-weight-bold mb-0">
                      <img
                        style={{ width: "2.5rem", height: "auto", marginRight: 3 }}
                        className="rounded-circle shadow-md"
                        src={this.state.seller.avatar}
                        alt="Profilbild"
                      />{" "}
                      {this.state.seller.username}
                    </p>
                    <Button
                      className="ml-auto px-3"
                      variant="success"
                      size="sm"
                      style={{ borderRadius: 12 }}
                      disabled={true}
                    >
                      Kontaktieren
                    </Button>
                  </div>

                  <div className="bg-light p-3" style={{ borderRadius: 12 }}>
                    <h3 className="font-weight-bold">{offer.name}</h3>
                    <h5 className="font-weight-bold">{offer.price.toLocaleString(undefined)} €</h5>
                    <p className="mb-0">{this.state.countdown}</p>
                    {offer.type === 1 ? (
                      <InputGroup className="mb-2">
                        <FormControl
                          className="bg-light"
                          placeholder="Gebot"
                          style={{ borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}
                        />
                        <InputGroup.Append>
                          <InputGroup.Text>.00 €</InputGroup.Text>
                        </InputGroup.Append>
                        <InputGroup.Append>
                          <Button
                            variant="success"
                            style={{ borderTopRightRadius: 12, borderBottomRightRadius: 12 }}
                          >
                            Bieten
                          </Button>
                        </InputGroup.Append>
                      </InputGroup>
                    ) : (
                      <Button className="w-100" variant="success" style={{ borderRadius: 12 }}>
                        Kaufen
                      </Button>
                    )}
                    <p className="font-weight-bold mb-0">Beschreibung</p>
                    <p className="mb-0">{offer.description}</p>
                  </div>
                </aside>
              </Col>
            </div>
          </div>
        </section>
      );
    }
  }
}
