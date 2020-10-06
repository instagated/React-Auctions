import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, useParams } from "react-router-dom";
import Loader from "./components/Loader";
import Auction from "./Auction";
import Moneybar from "./components/Moneybar";
import Navigation from "./components/Navbar";
import Breadcrumb from "./components/Breadcrumb";
import OffersScreen from "./screens/OffersScreen";
import OfferScreen from "./screens/OfferScreen";
import Footer from "./components/Footer";
import "./App.scss";

function ProfileScreen() {
  let { user } = useParams();
  return <h2>Profile of {user}</h2>;
}

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
          target: "https://dulliag.de/Auktionen/",
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
    };
  }

  componentDidMount() {
    new Auction().getOffers().then((offers) => {
      let temp = [];
      for (const key in offers) {
        let offer = offers[key];
        offer.id = key;
        temp.push(offers[key]);
      }
      this.setState({ offers: temp });
    });
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Moneybar cash={"50.000 €"} bank={"500.000 €"} />
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
