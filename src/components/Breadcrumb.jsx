import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/breadcrumb.scss";
import { withRouter } from "react-router-dom";

class Breadcrumb extends Component {
  constructor() {
    super();
    this.state = {
      path: ["DulliAG", "Auktionen"],
    };
  }

  componentDidMount() {
    const { path } = this.state,
      history = this.props.history,
      location = history.location,
      route = location.pathname.split("/")[1];
    // We're gonna check if the route is equal to "" because if were on the landingpage of the
    // application the indexroute will be "/" which equals "" after we splitted the pathname
    path.push(route !== "" ? route : "Angebote");
    // Listen for route changes
    history.listen((location) => {
      const newRoute = location.pathname.split("/")[1];
      path.splice(0, path.length); // Clear the current saved route
      path.push("DulliAG", "Auktionen");
      path.push(newRoute !== "" ? newRoute : "Angebote");
    });
  }

  render() {
    const { path } = this.state;

    return (
      <nav>
        <ol className="breadcrumb rounded-0">
          {path.map((site, index) => {
            return (
              <li
                className={path.length === index + 1 ? "breadcrumb-item active" : "breadcrumb-item"}
                key={index}
              >
                <a href="#">{site}</a>
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
}

export default withRouter(Breadcrumb);
