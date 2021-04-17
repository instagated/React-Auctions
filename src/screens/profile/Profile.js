// TODO Check if this code is still up-to-date & optimize it a little bit
import React, { Component, createRef } from "react";
import Firebase, { firestore } from "../../Firebase";
import { User, Offer as OfferAPI } from "../../ApiHandler";
import { toast as toastConfig } from "../../config.json";
import ToastService from "react-material-toast";
// Components
import { Link, Redirect } from "react-router-dom";
import { Col, Form, ButtonGroup, Button, Nav, Tab, Table, Badge } from "react-bootstrap";
import Loader from "../../components/Loader";
import { Offer } from "../../components/Card";
import { CreateOffer } from "../../components/Modals";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
// Stylesheets
import "bootstrap/dist/css/bootstrap.min.css";
import "./Profil.scss";

const UserHandler = new User();

class BuyHistory extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    const currentUser = Firebase.auth().currentUser;
    const offerList = [];

    if (currentUser) {
      const userId = currentUser.uid;
      const sellerRef = firestore.collection("user").doc(userId);
      const sellerUid = sellerRef.id; // Should be equal with userId/currentUser.uid
      firestore
        .collection("offers")
        .where("bought.uid", "==", sellerUid)
        .onSnapshot((snapshot) => {
          const docList = snapshot.docs;
          docList.forEach((document) => {
            var offer = document.data();
            offer.id = document.id;
            offerList.push(offer);
          });
          this.setState({ offers: offerList, loading: false });
        });
    }
  }

  render() {
    const { loading, offers } = this.state;

    if (loading) {
      return <Loader />;
    } else {
      return (
        <div className="w-100 bg-light rounded">
          <Table className="no-wrap" responsive hover borderless>
            <thead>
              <tr className="text-center">
                <th>Status</th>
                <th>Typ</th>
                <th>Angebot</th>
                <th>Kaufpreis</th>
              </tr>
            </thead>
            <tbody>
              {offers.length > 0 ? (
                offers.map((offer, index) => {
                  return (
                    <tr key={index} className="text-center">
                      <td>{offer.type === 2 ? <Badge variant="success">Gekauft</Badge> : null}</td>
                      <td>
                        <Badge variant="success">
                          {offer.type === 1 ? "Auktion" : "Sofortkauf"}
                        </Badge>
                      </td>
                      <td>
                        <Link
                          to={`/Angebot/${offer.id}`}
                          className="text-dark text-decoration-none font-weight-bold"
                        >
                          {offer.name}
                        </Link>
                      </td>
                      <td>
                        <p className="font-weight-bold mb-0">
                          {offer.price.toLocaleString(undefined)} €
                        </p>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="text-center">
                  <td colSpan="5">
                    <p className="font-weight-bold mb-0">Keine Angebote gefunden</p>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      );
    }
  }
}

class SellHistory extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    const currentUser = Firebase.auth().currentUser;
    const offerList = [];

    if (currentUser) {
      const userId = currentUser.uid;
      const sellerRef = firestore.collection("user").doc(userId);
      firestore
        .collection("offers")
        .where("seller", "==", sellerRef)
        .onSnapshot((snapshot) => {
          const docList = snapshot.docs.reverse(); // reverse the array so get got the items sorted by the newest
          docList.forEach((document) => {
            var offer = document.data();
            offer.id = document.id;
            offerList.push(offer);
          });
          this.setState({ offers: offerList, loading: false });
        });
    }
  }

  render() {
    const { loading, offers } = this.state;

    if (loading) {
      return <Loader />;
    } else {
      return (
        <div className="w-100 bg-light rounded">
          <Table className="no-wrap" responsive hover borderless>
            <thead>
              <tr className="text-center">
                <th>Status</th>
                <th>Typ</th>
                <th>Angebot</th>
                <th>Aktueller Preis</th>
                <th>Käufer</th>
              </tr>
            </thead>
            <tbody>
              {offers.length > 0 ? (
                offers.map((offer, index) => {
                  const now = Date.now() / 1000; // We're using timestamp in seconds
                  const expireDiff = offer.expiresAt.seconds - now;
                  return (
                    <tr key={index} className="text-center">
                      <td>
                        {offer.bought === undefined && expireDiff > 0 ? (
                          <Badge variant="warning">Aktuell</Badge>
                        ) : offer.bought !== undefined ? (
                          <Badge variant="success">Verkauft</Badge>
                        ) : (
                          <Badge variant="danger">Abgelaufen</Badge>
                        )}
                      </td>
                      <td>
                        <Badge variant="success">
                          {offer.type === 1 ? "Auktion" : "Sofortkauf"}
                        </Badge>
                      </td>
                      <td>
                        <Link
                          to={`/Angebot/${offer.id}`}
                          className="text-dark text-decoration-none font-weight-bold"
                        >
                          {offer.name}
                        </Link>
                      </td>
                      <td>
                        <p className="font-weight-bold mb-0">
                          {offer.price.toLocaleString(undefined)} €
                        </p>
                      </td>
                      <td>
                        {offer.bought !== undefined ? (
                          <p className="font-weight-bold mb-0">{offer.bought.username}</p>
                        ) : (
                          <p className="font-weight-bold mb-0">Kein Käufer</p>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="text-center">
                  <td colSpan="5">
                    <p className="font-weight-bold mb-0">Keine Angebote gefunden</p>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      );
    }
  }
}

class Offers extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    const currentUser = Firebase.auth().currentUser;
    const offerList = [];
    if (currentUser) {
      const userId = Firebase.auth().currentUser.uid;
      const sellerRef = firestore.collection("user").doc(userId);
      // We don't need to check if the user is signed in because the parent component will check if the
      // current authentification-state and redirect any user which isn't signed in to the sign-in screen
      firestore
        .collection("offers")
        .where("seller", "==", sellerRef)
        .onSnapshot((snapshot) => {
          const docList = snapshot.docs.reverse(); // reverse the array so we got them sort by date

          if (docList.length > 0) {
            docList.forEach((document) => {
              const offerData = document.data();
              const now = Date.now() / 1000; // Timestamp in seconds
              if (offerData.bought === undefined && offerData.expiresAt.seconds > now) {
                offerData.id = document.id;
                offerList.push(offerData);
              }
            });
            this.setState({ offers: offerList, loading: false });
          } else {
            this.setState({ offers: offerList, loading: false });
          }
        });
    }
  }

  render() {
    const { loading, offers } = this.state;

    if (loading) {
      return <Loader />;
    } else {
      return (
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
          {offers.length > 0 ? (
            offers.map((offer, index) => {
              return (
                <Col xs={12} md={6} lg={6} xl={6} key={index} className={"offer-column mb-3"}>
                  <div>
                    <Link to={`/Angebot/${offer.id}`} style={{ textDecoration: "none" }}>
                      <Offer
                        type={offer.type}
                        canDeleted={true}
                        thumbnail={offer.images.thumbnail}
                        name={offer.name}
                        description={offer.description}
                        price={offer.price}
                      />
                    </Link>
                  </div>
                </Col>
              );
            })
          ) : (
            <div className="bg-light mx-auto px-4 py-3 rounded w-100">
              <h3 className="font-weight-bold text-center mb-0">Keine Angebote gefunden</h3>
            </div>
          )}
        </div>
      );
    }
  }
}

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      editProfile: false,
      offerModal: false,
    };
    this.toast = ToastService.new(toastConfig);
    this.modalRef = createRef();
  }

  toggleProfileState = () =>
    this.setState((prevState) => ({
      editProfile: !prevState.editProfile,
    }));

  handleProfileSubmit = (e) => {
    e.preventDefault();
    const { user } = this.state;
    const { email, password } = e.target.elements;
    const authentificatedUser = Firebase.auth().currentUser;

    var updateEmail =
        email.value !== user.email ? authentificatedUser.updateEmail(email.value) : null,
      updatePassword =
        password.value !== "" ? authentificatedUser.updatePassword(password.value) : null;

    this.toggleProfileState();
    Promise.all([updateEmail, updatePassword])
      .then(() => {
        this.toast.success("Die Änderungen wurden gespeichert");
      })
      .catch((err) => {
        console.error(err);
        switch (err.code) {
          case "auth/requires-recent-login":
            const user = Firebase.auth().currentUser;
            const alreadyVerified = user.emailVerified;
            // We're gonna check if the email is already verified bcause if he is he only need to relog
            alreadyVerified
              ? this.toast.info(
                  "Bitte melde dich einmal neu an bevor du dein Profil bearbeiten kannst"
                )
              : this.toast.error(
                  "Du musst deine E-Mail Adresse erst bestätigen bevor du sie ändern kannst"
                );
            break;

          default:
            this.toast.error("Die Änderungen konnten nicht gespeichert werden");
            break;
        }
      });
  };

  componentDidMount() {
    // Check if the user is signed in via Firebase
    Firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const userId = user.uid;
        firestore
          .collection("user")
          .doc(userId)
          .get()
          .then((doc) => {
            user.username = doc.data().username;
            var avatarUrl = UserHandler.getAvatar(user.username);
            this.setState({
              authentificated: true,
              loading: false,
              avatar: avatarUrl,
              user: user,
              email: user.email,
            });
          });
      } else {
        this.setState({ authentificated: false, loading: false });
      }
    });
  }

  render() {
    const { loading, authentificated } = this.state;
    const { editProfile, avatar, user, email, offerModal } = this.state;

    if (loading) {
      return null;
    } else {
      if (authentificated) {
        return (
          <section>
            <div>
              <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                <Col
                  id="profile-container"
                  className="px-0 px-md-3 mb-3 mb-md-0"
                  xs={12}
                  md={4}
                  lg={4}
                >
                  <div className="bg-light w-100 p-4 rounded">
                    <img id="avatar" className="mb-3" alt="Profilbild" src={avatar} />
                    <form onSubmit={this.handleProfileSubmit}>
                      <p className="font-weight-bold text-center">
                        @{user.displayName}
                        <a className="text-success ml-2" onClick={() => this.toggleProfileState()}>
                          <FontAwesomeIcon icon={faPencilAlt} className="icon" />
                        </a>
                      </p>

                      <ButtonGroup className={editProfile ? "w-100 mb-3" : "d-none"}>
                        <Button
                          variant="outline-secondary"
                          onClick={() => {
                            this.toggleProfileState();
                            this.setState({ email: user.email });
                          }}
                        >
                          Abbrechen
                        </Button>
                        <Button type="submit" variant="success">
                          Speichern
                        </Button>
                      </ButtonGroup>

                      <Form.Group className="mb-0">
                        <Form.Label className="font-weight-bold">E-Mail</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          readOnly={!editProfile}
                          value={email}
                          onChange={(e) => this.setState({ email: e.target.value })}
                        />
                      </Form.Group>

                      <Form.Group className="mb-0">
                        <Form.Label className="font-weight-bold">Passwort</Form.Label>
                        <Form.Control
                          type="text"
                          name="password"
                          readOnly={!editProfile}
                          placeholder="Passwort unsichtbar"
                          onChange={(e) => this.setState({ password: e.target.value })}
                        />
                      </Form.Group>
                    </form>
                  </div>
                </Col>
                <Col id="profile-content" className="px-0 px-md-3" xs={12} md={8} lg={8}>
                  <Tab.Container defaultActiveKey="offers">
                    <div className="w-100 p-4 bg-light rounded mb-3">
                      <Nav variant="pills" display="row">
                        <Nav.Link eventKey="offers">Angebote</Nav.Link>
                        <Nav.Link eventKey="sell-history">Verkaufshistorie</Nav.Link>
                        <Nav.Link eventKey="buy-history">Kaufhistorie</Nav.Link>
                        <Nav.Link id="create-offer" onClick={() => this.modalRef.handleShow()}>
                          Angebot erstellen
                        </Nav.Link>
                      </Nav>
                    </div>
                    <Tab.Content>
                      <Tab.Pane eventKey="offers">
                        <Offers />
                      </Tab.Pane>
                      <Tab.Pane eventKey="sell-history">
                        <SellHistory />
                      </Tab.Pane>
                      <Tab.Pane eventKey="buy-history">
                        <BuyHistory />
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </Col>
              </div>
              <CreateOffer shown={offerModal} ref={(target) => (this.modalRef = target)} />
            </div>
          </section>
        );
      } else {
        // Redirect to the sign in page?
        return <Redirect to={"../Anmelden/"} />;
      }
    }
  }
}

export { Offers, BuyHistory, SellHistory };
export default Profile;
