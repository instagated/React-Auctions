import React, { Component } from "react";
import { version } from "../../package.json";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/footer.scss";

export default class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <div className="links py-5">
          <div className="row mx-0">
            <div className="link-container col-md-2 col-6 mb-3 mb-md-0 pl-0 pl-md-3">
              <h5 className="mb-1 text-success">Allgemeines</h5>
              <ul className="list-unstyled text-small">
                <li>
                  <a href="https://dulliag.de/impressum.php">Impressum</a>
                </li>
                <li>
                  <a href="https://dulliag.de/datenschutz.php">Datenschutz</a>
                </li>
              </ul>
            </div>

            <div className="link-container col-md-2 col-6 mb-3 mb-md-0 pr-0 pr-md-3">
              <h5 className="mb-1 text-success">Links</h5>
              <ul className="list-unstyled text-small">
                <li>
                  <a href="ts3server://ts.dulliag.de">TeamSpeak 3</a>
                </li>
                <li>
                  <a href="https://discord.gg/szQjjuH">Discord</a>
                </li>
                <li>
                  <a href="https://steamcommunity.com/groups/dulliag">Steam Gruppe</a>
                </li>
              </ul>
            </div>

            <div className="link-container col-md-2 col-6 mb-3 mb-md-0 pl-0 pl-md-3">
              <h5 className="mb-1 text-success">Sponsoren</h5>
              <ul className="list-unstyled text-small"></ul>
            </div>

            <div className="link-container col-md-2 col-6 mb-3 mb-md-0 pr-0 pr-md-3">
              <h5 className="mb-1 text-success">Administration</h5>
              <ul className="list-unstyled text-small">
                <li>
                  <a href="https://info.dulliag.de/">Infopanel</a>
                </li>
              </ul>
            </div>

            <div className="link-container col-md-4 col-12 px-0">
              <a href="https://zap-hosting.com/a/d9c331376435cc3068016ee7e16d884d41a6f39c">
                <img
                  className="banner"
                  src="https://files.dulliag.de/share/zapBanner.jpg"
                  alt="ZAP-Hosting Gameserver and Webhosting"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="credits">
          <p className="text text-center py-4 mb-0">
            © {new Date().getFullYear()} Auktionshaus v{version} by{" "}
            <a href="https://thorben.dulliag.de" className="text-link">
              Thorben Klein
            </a>
          </p>
        </div>
      </footer>
    );
  }
}
