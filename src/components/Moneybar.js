import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPiggyBank, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Moneybar.scss";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default class Moneybar extends Component {
  render() {
    return (
      <div className="moneybar">
        <div className="row align-items-center">
          <OverlayTrigger placement="bottom" overlay={<Tooltip>Bargeld</Tooltip>}>
            <p>
              <FontAwesomeIcon icon={faMoneyBill} className="icon" />
              {this.props.cash}
            </p>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={<Tooltip>Kontostand</Tooltip>}>
            <p className="ml-3">
              <FontAwesomeIcon icon={faPiggyBank} className="icon" />
              {this.props.bank}
            </p>
          </OverlayTrigger>
          <a href="#" className="text ml-auto">
            Anmelden
          </a>
        </div>
      </div>
    );
  }
}
