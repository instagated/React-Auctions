import React, { Component, createRef } from "react";
import { BrowserRouter as Router, Switch, Route, useParams } from "react-router-dom";
// Screens
import SignIn from "./screens/sign_in/SignIn";
import SignUp from "./screens/sign_up/SignUp";
import Profile from "./screens/profile/Profile";
import OffersScreen from "./screens/offers/OffersScreen";
import OfferScreen from "./screens/offer/OfferScreen";
// Components
import Loader from "./components/Loader";
import KeyModal from "./components/KeyModal";
import Auction from "./Auction";
import Moneybar from "./components/Moneybar";
import Navigation from "./components/Navbar";
import Breadcrumb from "./components/Breadcrumb";
import Footer from "./components/Footer";
import "./App.scss";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      path: ["DulliAG", "Auktionen"],
      links: [
        {
          active: false,
          name: "Startseite",
          target: "https://dulliag.de",
        },
        {
          active: true,
          name: "Auktionshaus",
          target: "https://auktionen.dulliag.de/",
        },
        {
          active: false,
          name: "EFT Markt",
          target: "https://eft.dulliag.de/",
        },
        {
          active: false,
          name: "Galerie",
          target: "https://dulliag.de/Galerie/",
        },
        {
          active: false,
          name: "Mitglieder",
          target: "https://dulliag.de/Mitglieder/",
        },
        {
          active: false,
          name: "Support",
          target: "https://dulliag.de/Support/",
        },
      ],
      offers: null,
      cash: null,
      bank: null,
      pid: null,
    };
    this.keyModalRef = createRef();
    this.moneyBarRef = createRef();
  }

  getPlayer(apiKey) {
    return new Promise((res, rej) => {
      fetch(`https://api.realliferpg.de/v1/player/${apiKey}`)
        .then((response) => response.json())
        .then((data) => res(data))
        .catch((err) => rej(err));
    });
  }

  componentDidMount() {
    // Get the offers from database
    new Auction().getOffers().then((offers) => {
      let temp = [];
      for (const key in offers) {
        let offer = offers[key];
        offer.id = key;
        temp.push(offers[key]);
      }
      this.setState({ offers: temp });
    });

    // Check if the API-Key is set
    let apiKey = localStorage.getItem("@dag_apiKey");
    if (apiKey !== null) {
      this.getPlayer(apiKey).then((playerData) => {
        let data = playerData.data[0];
        this.setState({ cash: data.cash, bank: data.bankacc, pid: data.pid });
      });
    } else {
      this.keyModalRef.handleShow();
    }
  }

  render() {
    return (
      <Router>
        <div className="App">
          <KeyModal shown={false} ref={(target) => (this.keyModalRef = target)} />
          <Moneybar
            cash={this.state.cash}
            bank={this.state.bank}
            ref={(target) => (this.moneyBarRef = target)}
          />
          <Navigation links={this.state.links} />
          <Breadcrumb path={this.state.path} />

          <Switch>
            <Route path="/Profil/:user">
              <ProfileScreen />
            </Route>
            <Route path="/Angebot/:id">
              <OfferScreen />
            </Route>
            <Route path="/Angebote">
              {this.state.offers != null ? <OffersScreen offers={this.state.offers} /> : <Loader />}
            </Route>
            <Route path="/">
              {this.state.offers != null ? <OffersScreen offers={this.state.offers} /> : <Loader />}
            </Route>
          </Switch>
          <Footer />
        </div>
      </Router>
    );
  }
}
