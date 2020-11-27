import React, { Component } from "react";
import { Card, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Card.scss";

export class Offer extends Component {
  render() {
    let props = this.props;
    return (
      <div>
        <Card className="offer">
          <Card.Img variant="top" src={props.thumbnail} />
          <Badge className="badge" variant="success">
            {props.type === 1 ? "Auktion" : "Sofortkauf"}
          </Badge>
          {canDeleted ? (
            <Button
              variant="danger"
              size="sm"
              className="remove-btn px-3"
              {/* There is no onClick required bcause the offer can only get deleted @ the OfferScreen */}
            >
              Löschen
            </Button>
          ) : null}
          <Card.Body>
            <Card.Title className="font-weight-bold mb-0">{props.name}</Card.Title>
            <Card.Text className="text-truncate mb-0">{props.description}</Card.Text>
            <Card.Text className="font-weight-bold">
              {props.type === 1
                ? `Gebot: ${props.price.toLocaleString(undefined)} €`
                : `Preis: ${props.price.toLocaleString(undefined)} €`}
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    );
  }
}
