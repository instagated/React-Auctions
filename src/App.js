import React, { Component, createRef } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Firebase from "./Firebase";
// Screens
import SignIn from "./screens/sign_in/SignIn";
import SignUp from "./screens/sign_up/SignUp";
import Profile from "./screens/profile/Profile";
import OffersScreen from "./screens/offers/OffersScreen";
import OfferScreen from "./screens/offer/OfferScreen";
// Components
import KeyModal from "./components/KeyModal";
import { VerifyEmail } from "./components/Modals";
import Moneybar from "./components/Moneybar";
import Navigation from "./components/Navbar";
import Breadcrumb from "./components/Breadcrumb";
import AuthentificationStatus from "./components/AuthentificationStatus";
import Footer from "./components/Footer";
//  Stylesheets
import "./App.scss";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
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
      cash: null,
      bank: null,
      pid: null,
      verified: true,
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
    // Check if the user is authentificated
    Firebase.auth().onAuthStateChanged((user) => {
      let authentificated = null;
      // console.log(user.uid);
      user ? (authentificated = true) : (authentificated = false);
      this.setState({ user: user, authentificated: authentificated });
    });
      const verified = user.emailVerified, // True if the user has already verified his email

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
                verified: verified,
  }

  render() {
    let { authentificated, verified, cash, bank, links } = this.state;
    return (
      <Router>
        <div className="App">
          <KeyModal shown={false} ref={(target) => (this.keyModalRef = target)} />
          <VerifyEmail shown={!verified} />
          <Moneybar
            authentificated={authentificated}
            cash={cash}
            bank={bank}
            ref={(target) => (this.moneyBarRef = target)}
          />
          <Navigation links={links} />
          <Breadcrumb />
          <AuthentificationStatus />
          <Switch>
            <Route path="/Anmelden/" component={SignIn} />
            <Route path="/Registrieren/" component={SignUp} />
            <Route path="/Profil/" component={Profile} />
            <Route path="/Angebot/:id" component={OfferScreen} />
            <Route path="/Angebote/" component={OffersScreen} />
            <Route path="/" component={OffersScreen} />
          </Switch>
          <Footer />
        </div>
      </Router>
    );
  }
}
