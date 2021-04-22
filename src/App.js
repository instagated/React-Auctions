import React, { Component, createRef } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Firebase, { firestore } from "./Firebase";
// Screens
import SignIn from "./screens/sign_in/SignIn";
import SignUp from "./screens/sign_up/SignUp";
import Profile from "./screens/profile/Profile";
import OffersScreen from "./screens/offers/OffersScreen";
import OfferScreen from "./screens/offer/OfferScreen";
// Components
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
          name: "URL kürzen",
          target: "https://url.dulliag.de/",
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
    this.moneyBarRef = createRef();
  }

  componentDidMount() {
    // Check if the user is authentificated
    Firebase.auth().onAuthStateChanged((user) => {
      const verified = user.emailVerified; // True if the user has already verified his email
      var authentificated = false; // Bcause the user is signed in
      if (user) {
        authentificated = true;
        const userId = user.uid;
        firestore
          .collection("user")
          .doc(userId)
          .get()
          .then((doc) => {
            this.setState({
              user: user,
              authentificated: authentificated,
              verified: verified,
            });
          });
      }
    });
  }

  render() {
    const { user, verified, links } = this.state;
    return (
      <Router>
        <div className="App">
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
