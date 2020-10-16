import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import Firebase from "../../Firebase";
import Divider from "../../components/Divider";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SignUp.scss";

class SignUp extends Component {
  clearForm = () => {
    this.formRef.reset();
  };

  handleForm = (event) => {
    event.preventDefault();
    // const { username, email, password } = event.target.elements;
    // console.log(username.value, email.value, password.value);
    const { email, password } = event.target.elements;
    Firebase.auth()
      .createUserWithEmailAndPassword(email.value, password.value)
      .then((user) => {
        this.clearForm();
        this.props.history.push("/");
      })
      .catch((err) => {
        /**
         * Valid errror codes (err.code)
         * auth/email-already-in-use
         * auth/invalid-email
         * auth/weak-password
         */
        console.log(err.message);
      });
  };

  render() {
    return (
      <section>
        <div>
          <div className="login-container mx-auto">
            <h2 className="text-center">Registrieren</h2>
            <Form onSubmit={this.handleForm} ref={(target) => (this.formRef = target)}>
              {/* <Form.Group>
                <Form.Label className="font-weight-bold">Benutzername</Form.Label>
                <Form.Control type="text" name="username" />
              </Form.Group> */}
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
