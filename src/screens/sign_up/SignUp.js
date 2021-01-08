import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import { toast as toastConfig } from "../../config.json";
import Firebase, { firestore } from "../../Firebase";
import Divider from "../../components/Divider";
import ToastServive from "react-material-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SignUp.scss";

class SignUp extends Component {
  constructor() {
    super();
    this.toast = ToastServive.new(toastConfig);
  }

  clearForm = () => {
    this.formRef.reset();
  };

  handleForm = (event) => {
    event.preventDefault();
    // const { username, email, password } = event.target.elements;
    // console.log(username.value, email.value, password.value);
    const { username, email, password } = event.target.elements;
    Firebase.auth()
      .createUserWithEmailAndPassword(email.value, password.value)
      .then(() => {
        const user = Firebase.auth().currentUser,
          userId = user.uid;
        user.updateProfile({
          displayName: username.value,
        });
        // FIXME Remove this part. We don't need it later
        firestore.collection("user").doc(userId).set({
          username: username.value,
          bought: [],
          offers: [],
        });

        this.clearForm();
        this.toast.success("Dein Benutzer wurde registriert");

        // Send an account verification email to the user
        user
          .sendEmailVerification()
          .then(() => {
            this.toast.info("In kürze wirst du eine Bestätigungsemail erhalten");
          })
          .catch((err) => {
            this.toast.warning("Die Bestätigungsemail konnte nicht verschickt werden");
            console.error(err);
          });

        // Redirect
        setTimeout(() => {
          this.props.history.push("/");
        }, 2500);
      })
      .catch((err) => {
        switch (err.code) {
          case "auth/email-already-in-use":
            this.toast.error("Die E-Mail Adresse ist bereits registriert");
            break;
          case "auth/invalid-email":
            this.toast.error("Bitte gib eine gültige E-Mail Adresse ein");
            break;
          case "auth/weak-password":
            this.toast.error("Das Passwort ist zu schwach");
            break;
          default:
            this.toast.warning("Der Benutzer wurde nicht registriert");
            break;
        }
        console.error("Firebase Authentification", err.message);
      });
  };

  render() {
    return (
      <section>
        <div>
          <div className="login-container mx-auto">
            <h2 className="text-center">Registrieren</h2>
            <Form onSubmit={this.handleForm} ref={(target) => (this.formRef = target)}>
              <Form.Group>
                <Form.Label className="font-weight-bold">Benutzername</Form.Label>
                <Form.Control type="text" name="username" />
              </Form.Group>
              <Form.Group>
                <Form.Label className="font-weight-bold">E-Mail</Form.Label>
                <Form.Control type="email" name="email" />
              </Form.Group>
              <Form.Group>
                <Form.Label className="font-weight-bold">Passwort</Form.Label>
                <Form.Control type="password" name="password" />
              </Form.Group>

              <div className="d-flex justify-content-center">
                <Button type="submit" variant="success" className="mx-auto px-4 shadow-none">
                  Registrieren
                </Button>
              </div>
            </Form>
            <Divider title="Schon einen Account?" />
            <Link
              className="btn btn-outline-success w-100 rounded-pill shadow-none"
              to={"../Anmelden/"}
            >
              Hier anmelden
            </Link>
          </div>
        </div>
      </section>
    );
  }
}

export default withRouter(SignUp);
