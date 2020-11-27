import React, { Component } from "react";
import { OverlayTrigger, Tooltip, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import Firebase from "../Firebase";
import ReallifeRPG from "../ReallifeRPG";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPiggyBank,
  faMoneyBill,
  faUserCircle,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/moneybar.scss";

// TODO Performance needs to be improved by a lot
export default class Moneybar extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    const apiKey = localStorage.getItem("@dag_apiKey");
    apiKey !== null && apiKey !== undefined
      ? new ReallifeRPG()
          .getPlayer(apiKey)
          .then((data) => this.setState({ player: data, loading: false }))
      : this.setState({ loading: false });
  }

  render() {
    const { loading, player } = this.state,
      { user } = this.props;

    if (loading) {
      return null;
    } else {
      if (user) {
        return (
          <div className="moneybar">
            <div className="row align-items-center">
              <OverlayTrigger placement="bottom" overlay={<Tooltip>Bargeld</Tooltip>}>
                <p>
                  <FontAwesomeIcon icon={faMoneyBill} className="icon" />
                  {player.data[0].cash !== null
                    ? `${player.data[0].cash.toLocaleString(undefined)} €`
                    : null}
                </p>
              </OverlayTrigger>
              <OverlayTrigger placement="bottom" overlay={<Tooltip>Kontostand</Tooltip>}>
                <p className="ml-3">
                  <FontAwesomeIcon icon={faPiggyBank} className="icon" />
                  {player.data[0].bankacc !== null
                    ? `${player.data[0].bankacc.toLocaleString(undefined)} €`
                    : null}
                </p>
              </OverlayTrigger>
              <Dropdown>
                <Dropdown.Toggle variant="success">
                  <img src={player.data[0].avatar_full} alt="Profilbild" />
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
