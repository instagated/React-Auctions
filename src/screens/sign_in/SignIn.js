import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import Firebase from "../../Firebase";
import Divider from "../../components/Divider";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SignIn.scss";

class SignIn extends Component {
  constructor() {
    super();
  }

  clearForm = () => {
    this.formRef.reset();
  };

  handleForm = (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    // console.log(email.value, password.value);
    Firebase.auth()
      .signInWithEmailAndPassword(email.value, password.value)
      .then((user) => {
        this.clearForm();
        this.props.history.push("/");
      })
      .catch((err) => {
        /**
         * Valid errror codes (err.code)
         * auth/invalid-email
         * auth/user-disabled
         * auth/user-not-found
         * auth/wrong-password
         */
        console.log(err.message);
      });
  };

  render() {
    return (
      <section>
        <div>
          <div className="login-container mx-auto">
            <h2 className="text-center">Anmelden</h2>
            <Form onSubmit={this.handleForm} ref={(target) => (this.formRef = target)}>
              <Form.Group>
                <Form.Label className="font-weight-bold">E-Mail</Form.Label>
                <Form.Control type="email" name="email" />
              </Form.Group>
              <Form.Group>
                <Form.Label className="font-weight-bold">Passwort</Form.Label>
                <Form.Control type="password" name="password" />
                <Form.Text className="text-right">
                  <a href="https://dulliag.de/Support/">Passwort vergessen?</a>
                </Form.Text>
              </Form.Group>

              <div className="d-flex justify-content-center">
                <Button type="submit" variant="success" className="mx-auto px-4 shadow-none">
                  Anmelden
                </Button>
              </div>
            </Form>
            <Divider title="Noch keinen Account?" />
            <Link
              className="btn btn-outline-success w-100 rounded-pill shadow-none"
              to={"../Registrieren/"}
            >
              Hier registrieren
            </Link>
          </div>
        </div>
      </section>
    );
  }
}

export default withRouter(SignIn);
