import React, { Component } from "react";
import { OverlayTrigger, Tooltip, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import Firebase, { firestore } from "../Firebase";
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
  constructor() {
    super();
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    let userData = null;
    Firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firestore
          .collection("user")
          .doc(user.uid)
          .get()
          .then((doc) => (userData = doc.data()))
          .then(() => this.setState({ user: userData, loading: false }));
      } else {
        this.setState({ loading: false });
      }
    });
  }

  render() {
    let { loading, user } = this.state;
    let { authentificated, cash, bank } = this.props;
    // FIXME Get the avatar from the instead of using the DulliAG logo

    if (loading) {
      return null;
    } else {
      if (authentificated) {
        return (
          <div className="moneybar">
            <div className="row align-items-center">
              <OverlayTrigger placement="bottom" overlay={<Tooltip>Bargeld</Tooltip>}>
                <p>
                  <FontAwesomeIcon icon={faMoneyBill} className="icon" />
                  {`${cash.toLocaleString(undefined)} €`}
                </p>
              </OverlayTrigger>
              <OverlayTrigger placement="bottom" overlay={<Tooltip>Kontostand</Tooltip>}>
                <p className="ml-3">
                  <FontAwesomeIcon icon={faPiggyBank} className="icon" />
                  {`${bank.toLocaleString(undefined)} €`}
                </p>
              </OverlayTrigger>
              <Dropdown>
                <Dropdown.Toggle variant="success">
                  <img src={"https://files.dulliag.de/web/images/logo.jpg"} alt="Profilbild" />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {user !== undefined ? <Dropdown.Item>{user.username}</Dropdown.Item> : null}
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
              <Link className="text ml-auto" to={"../Anmelden/"}>
                Anmelden
              </Link>
            </div>
          </div>
        );
      }
    }
  }
}
