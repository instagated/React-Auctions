import React, { Component } from "react";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Offer } from "../../components/Card";
import Loader from "../../components/Loader";
import { firestore } from "../../Firebase";
import "bootstrap/dist/css/bootstrap.min.css";

export default class OffersScreen extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    let temp = [];
    firestore
      .collection("offers")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        let changes = snapshot.docChanges();
        changes.forEach((change) => {
          let doc = change.doc,
            data = doc.data(),
            now = parseInt((Date.now() / 1000).toFixed(0));

          if (change.type === "added") {
            if (data.expiresAt.seconds > now && data.bought === undefined) {
              data.id = doc.id;
              temp.push(data);
            }
          } else if (change.type === "removed") {
            temp = temp.filter((offer) => {
              return offer.id !== doc.id;
            });
          } else if (change.type === "modified") {
            temp = temp.filter((offer) => {
              return offer.id !== doc.id;
            });
            temp.push(data);
          }
        });
        this.setState({ offers: temp, loading: false });
      });
  }

  render() {
    let { loading, offers } = this.state;

    if (loading) {
      return <Loader />;
    } else {
      return (
        <section>
          <div>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
              {offers.length > 0 ? (
                offers.map((offer, index) => {
                  return (
                    <Col
                      xs={12}
                      md={6}
                      lg={6}
                      xl={3}
                      key={index}
                      className={(offers.lenth < 4 ? "mb-md-0" : "", "mb-3 px-0 px-md-3")}
                    >
                      <div>
                        <Link to={`/Angebot/${offer.id}`} style={{ textDecoration: "none" }}>
                          <Offer
                            canDeleted={false}
                            type={offer.type}
                            thumbnail={offer.images.thumbnail}
                            name={offer.name}
                            description={offer.description}
                            price={offer.price}
                          />
                        </Link>
                      </div>
                    </Col>
                  );
                })
              ) : (
                <div className="bg-light mx-auto px-4 py-3 rounded">
                  <h3 className="font-weight-bold text-center mb-0">Keine Angebote gefunden</h3>
                </div>
              )}
            </div>
          </div>
        </section>
      );
    }
  }
}
