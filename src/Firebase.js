import firebase from "firebase";
import "firebase/auth";
const { firebaseConfig } = require("./config.json");

const firebaseApp = firebase.initializeApp(firebaseConfig);
firebaseApp.analytics();

export default firebaseApp;
