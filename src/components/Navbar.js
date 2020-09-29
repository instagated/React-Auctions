import React, { Component, useState } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.scss";

export default class Navigation extends Component {
  constructor() {
    super();
    this.state = {
      active: false,
    };
  }

  toggleMenu = () => {
    let status = this.state.active;
    this.setState({ active: !status });
  };

  render() {
    return (
      <Navbar bg="light" expand="lg" sticky="top" className="navbar">
        <Navbar.Brand href="https://dulliag.de" className="brand">
          DulliAG
        </Navbar.Brand>
        <Navbar.Toggle
          onClick={() => this.toggleMenu()}
          className={this.state.active == false ? "menu-toggler" : "menu-toggler active"}
        >
          <div className="hamburger">
            <div className="btn-line"></div>
            <div className="btn-line"></div>
            <div className="btn-line"></div>
          </div>
        </Navbar.Toggle>
        <Navbar.Collapse>
          <Nav className="ml-auto">
            {this.props.links.map((link, index) => {
              return (
                <Nav.Link
                  key={index}
                  href={link.target}
                  className={link.active == false ? "link" : "link active"}
                >
                  {link.name}
                </Nav.Link>
              );
            })}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
