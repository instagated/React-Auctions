import React from "react";
import Moneybar from "./components/Moneybar";
import Navigation from "./components/Navbar";
import Breadcrumb from "./components/Breadcrumb";
import OffersScreen from "./screens/OffersScreen";
import OfferScreen from "./screens/OfferScreen";
import Footer from "./components/Footer";
import "./App.scss";

function ProfileScreen() {
  let { user } = useParams();
  return <h2>Profile of {user}</h2>;
}

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

  let offers = [
    {
      id: 543534,
      type: 1,
      images: {
        thumbnail: "https://files.dulliag.de/share/HLL-Win64-Shipping_xWnEuiM0wZ.jpg",
        product: [
          "https://files.dulliag.de/share/HLL-Win64-Shipping_xWnEuiM0wZ.jpg",
          "https://files.dulliag.de/share/HLL-Win64-Shipping_xWnEuiM0wZ.jpg",
        ],
      },
      name: "MP 40",
      description:
        "Some quick example text to build on the card title and make up the bulk of the cards content.",
      price: 5000,
    },
    {
      id: 9564395,
      type: 2,
      images: {
        thumbnail: "https://files.dulliag.de/share/HLL-Win64-Shipping_xWnEuiM0wZ.jpg",
        product: [
          "https://files.dulliag.de/share/HLL-Win64-Shipping_xWnEuiM0wZ.jpg",
          "https://files.dulliag.de/share/HLL-Win64-Shipping_xWnEuiM0wZ.jpg",
        ],
      },
      name: "MP 40",
      description:
        "Some quick example text to build on the card title and make up the bulk of the cards content.",
      price: 500000,
    },
  ];

  return (
  );
}

export default App;
