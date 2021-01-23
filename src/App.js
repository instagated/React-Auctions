import React, { Component, createRef } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Firebase, { firestore } from "./Firebase";
import ReallifeRPG from "./ReallifeRPG";
// Screens
import SignIn from "./screens/sign_in/SignIn";
import SignUp from "./screens/sign_up/SignUp";
import Profile from "./screens/profile/Profile";
import OffersScreen from "./screens/offers/OffersScreen";
import OfferScreen from "./screens/offer/OfferScreen";
// Components
import { SetApiKey, VerifyEmail } from "./components/Modals";
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

  componentDidMount() {
    // Check if the user is authentificated
    Firebase.auth().onAuthStateChanged((user) => {
      const verified = user.emailVerified, // True if the user has already verified his email
        apiKey = localStorage.getItem("@dag_apiKey");
      let authentificated = false; // Bcause the user is signed in
      if (user) {
        authentificated = true;
        const userId = user.uid;
        firestore
          .collection("user")
          .doc(userId)
          .get()
          .then((doc) => {
            apiKey !== null
              ? new ReallifeRPG().getPlayer(apiKey).then((playerData) => {
                  const data = playerData.data[0];
                  this.setState({
                    user: user,
                    authentificated: authentificated,
                    verified: verified,
                    cash: data.cash,
                    bank: data.bankacc,
                    pid: data.pid,
                  });
                })
              : this.keyModalRef.handleShow();
          });
      }
    });
  }

  render() {
    let { user, verified, links } = this.state;
    return (
      <Router>
        <div className="App">
          <SetApiKey shown={false} ref={(target) => (this.keyModalRef = target)} />
          <VerifyEmail shown={!verified} />
          <Moneybar user={user} ref={(target) => (this.moneyBarRef = target)} />
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
