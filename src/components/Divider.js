import React, { Component } from "react";
import "./Divider.scss";

export default class Divider extends Component {
  render() {
    return <hr className="divider" title={this.props.title} />;
  }
}
