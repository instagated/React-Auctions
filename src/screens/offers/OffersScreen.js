import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Offer } from "../../components/Card";
import Loader from "../../components/Loader";
import "bootstrap/dist/css/bootstrap.min.css";

export default class OffersScreen extends Component {
  render() {
    let now = parseInt((Date.now() / 1000).toFixed(0));
    return (
      <section>
        <div>
          <Row>
            {this.props.offers.map((offer, index) => {
              return offer.expiresAt > now ? (
                <Col
                  xs={12}
                  md={6}
                  lg={6}
                  xl={3}
                  key={index}
                  className={this.props.offers.lenth > 4 ? "mb-3" : "mb-mb-3"}
                >
                  <div>
                    <Link to={`/Angebot/${offer.id}`} style={{ textDecoration: "none" }}>
                      <Offer
                        type={offer.type}
                        thumbnail={offer.images.thumbnail}
                        name={offer.name}
                        description={offer.description}
                        price={offer.price}
                      />
                    </Link>
                  </div>
                </Col>
              ) : (
                <Loader />
              );
            })}
          </Row>
        </div>
      </section>
    );
  }
}
