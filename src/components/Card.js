import React, { Component } from "react";
import { Card, Badge, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/card.scss";

export class Offer extends Component {
  render() {
    const { canDeleted, thumbnail, type, name, description, price } = this.props;
    return (
      <div>
        <Card className="offer">
          <Card.Img variant="top" src={thumbnail} />
          <Badge className="badge" variant="success">
            {type === 1 ? "Auktion" : "Sofortkauf"}
          </Badge>
          {canDeleted ? (
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
          ) : null}
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
