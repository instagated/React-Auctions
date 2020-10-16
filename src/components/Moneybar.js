import React, { Component } from "react";
import { OverlayTrigger, Tooltip, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import Firebase from "../Firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPiggyBank,
  faMoneyBill,
  faUserCircle,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Moneybar.scss";

export default class Moneybar extends Component {
  render() {
    let props = this.props;
    if (props.authentificated) {
      return (
        <div className="moneybar">
          <div className="row align-items-center">
            <OverlayTrigger placement="bottom" overlay={<Tooltip>Bargeld</Tooltip>}>
              <p>
                <FontAwesomeIcon icon={faMoneyBill} className="icon" />
                {props.cash != null ? `${props.cash.toLocaleString(undefined)} €` : "Lädt"}
              </p>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>Kontostand</Tooltip>}>
              <p className="ml-3">
                <FontAwesomeIcon icon={faPiggyBank} className="icon" />
                {props.bank != null ? `${props.bank.toLocaleString(undefined)} €` : "Lädt"}
              </p>
            </OverlayTrigger>
            <Dropdown>
              <Dropdown.Toggle variant="success">
                <img src={"https://files.dulliag.de/web/images/logo.jpg"} alt="Profilbild" />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {/* <Dropdown.Item>
                  {props.displayname ? props.displayname : "Benutzername"}
                </Dropdown.Item> */}
                <Dropdown.Item href="../Profil/">
                  <FontAwesomeIcon icon={faUserCircle} className="icon" /> Mein Profil
                </Dropdown.Item>
                <Dropdown.Item onClick={() => Firebase.auth().signOut()}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="icon" /> Abmelden
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      );
    } else {
      return (
        <div className="moneybar">
          <div className="row align-items-center">
            <Link className="text ml-auto" to={"./Anmelden/"}>
              Anmelden
            </Link>
          </div>
        </div>
      );
    }
  }
}
