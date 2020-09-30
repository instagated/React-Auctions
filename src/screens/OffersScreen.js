import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Offer } from "../components/Card";
import "bootstrap/dist/css/bootstrap.min.css";

export default class OffersScreen extends Component {
  render() {
    return (
      <section>
        <div>
          <Row>
            {this.props.offers.map((offer, index) => {
              return (
                <Col xs={12} md={6} lg={3} key={index} className="mb-3 px-0 px-md-4">
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
              );
            })}
          </Row>
        </div>
      </section>
    );
  }
}
