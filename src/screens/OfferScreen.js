import React, { Component } from "react";
import { Col, Row, Button, InputGroup, FormControl } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./OfferScreen.scss";

export default class OfferScreen extends Component {
  constructor() {
    super();
    this.state = {
      offer: parseInt(window.location.href.split("/")[4]),
    };
  }

  render() {
    return (
      <section className="offer">
        <div>
          <Row>
            <Col xs={12} md={8} ld={8} className="px-0 px-md-4">
              <main>
                <div className="w-100 mb-3">
                  <img
                    className="thumbnail"
                    src="https://bilder.t-online.de/b/87/28/28/82/id_87282882/tid_da/doener-kebab-diese-berliner-spezialitaet-ist-auf-der-ganzen-welt-beruehmt-symbolbild-.jpg"
                    alt="Produktbild"
                  />
                </div>
                <div className="image-container mb-3">
                  <a className="image">
                    <img
                      src="https://bilder.t-online.de/b/87/28/28/82/id_87282882/tid_da/doener-kebab-diese-berliner-spezialitaet-ist-auf-der-ganzen-welt-beruehmt-symbolbild-.jpg"
                      alt="Vorschaubild"
                    />
                  </a>
                  <a className="image">
                    <img
                      src="https://bilder.t-online.de/b/87/28/28/82/id_87282882/tid_da/doener-kebab-diese-berliner-spezialitaet-ist-auf-der-ganzen-welt-beruehmt-symbolbild-.jpg"
                      alt="Vorschaubild"
                    />
                  </a>
                </div>
              </main>
            </Col>
            <Col xs={12} md={4} lg={4} className="px-0 px-md-4">
              <aside>
                <div className="d-flex bg-light mb-3 p-3" style={{ borderRadius: 12 }}>
                  <p className="font-weight-bold mb-0">
                    <img
                      style={{ width: "2.5rem", height: "auto" }}
                      className="rounded-circle shadow-md"
                      src={
                        "https://eu.ui-avatars.com/api/?name=Laura&amp;size=256&amp;background=fff&amp;color=212529"
                      }
                      alt="Profilbild"
                    />{" "}
                    Laura
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
                  <p className="mb-0">Verbleibende Zeit: 46 Tage & 23:46:12</p>
                  <h3 className="font-weight-bold">Deutsche MP 40</h3>
                  <h5 className="font-weight-bold">50.000 €</h5>
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
                  <p className="font-weight-bold mb-0">Beschreibung</p>
                  <p className="mb-0">
                    Some quick example text to build on the card title and make up the bulk of the
                    cards content.Some quick example text to build on the card title and make up the
                    bulk of the cards content.
                  </p>
                </div>
              </aside>
            </Col>
          </Row>
        </div>
      </section>
    );
  }
}
