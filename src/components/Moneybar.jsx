import React, { Component } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import Firebase from "../Firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/moneybar.scss";
import { User } from "../ApiHandler";

export default class Moneybar extends Component {
  render() {
    const { user } = this.props;

    if (user) {
      const avatarUrl = new User().getAvatar(user.displayName);
      return (
        <div className="moneybar">
          <div className="row align-items-center">
            <Dropdown>
              <Dropdown.Toggle variant="success">
                <img src={avatarUrl} alt="Profilbild" />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {user !== undefined && <Dropdown.Item>{user.displayName}</Dropdown.Item>}
                <Dropdown.Item href="../Profil/">
                  {/*<FontAwesomeIcon icon={faUserCircle} className="icon" /> */} Mein Profil
                </Dropdown.Item>
                <Dropdown.Item onClick={() => Firebase.auth().signOut()}>
                  {/* <FontAwesomeIcon icon={faSignOutAlt} className="icon" /> */} Abmelden
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
