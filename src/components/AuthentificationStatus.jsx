import React, { Component } from "react";
import Firebase from "../Firebase";

export default class AuthentificationStatus extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    Firebase.auth().onAuthStateChanged((user) => {
      console.log(user);
      this.setState({ loading: false, signedIn: user, verified: user.emailVerified });
    });
  }

  render() {
    const { loading, user, verified } = this.state;
    if (loading && user && !verified) {
      return null;
    } else {
      if (user && verified) {
        return (
          <div className="bg-success py-2">
            <p className="text-center text-white mb-0">
              Deine E-Mail Adresse wurde noch nicht verifiziert. Schaue mal in deinem E-Mail
              Postfach nach...
            </p>
          </div>
        );
      } else {
        return null;
      }
    }
  }
}
