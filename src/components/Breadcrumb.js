import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Breadcrumb.scss";

export default class Breadcrumb extends Component {
  render() {
    return (
      <nav>
        <ol className="breadcrumb rounded-0">
          {this.props.path.map((site, index) => {
            return (
              <li
                className={
                  this.props.path.length === index + 1
                    ? "breadcrumb-item active"
                    : "breadcrumb-item"
                }
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
