import React from "react";
import Breadcrumb from "./components/Breadcrumb";
import Moneybar from "./components/Moneybar";
import Navigation from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.scss";

function App() {
  let links = [
    {
      active: false,
      name: "Startseite",
      target: "https://dulliag.de",
    },
    {
      active: true,
      name: "Auktionshaus",
      target: "https://dulliag.de/Auktionen/",
    },
    {
      active: false,
      name: "Galerie",
      target: "https://dulliag.de/Galerie/",
    },
    {
      active: false,
      name: "Mitglieder",
      target: "https://dulliag.de/Mitglieder/",
    },
    {
      active: false,
      name: "Support",
      target: "https://dulliag.de/Support/",
    },
  ];

  return (
    <div className="App">
      <Moneybar cash={"50.000 €"} bank={"500.000 €"} />
      <Navigation links={links} />
      <Breadcrumb path={["DulliAG", "Auktionen"]} />
      <section>
        <h1>Test</h1>
      </section>
      <Footer />
    </div>
  );
}

export default App;
