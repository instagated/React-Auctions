import firebase from "firebase";
const { firebaseConfig } = require("./config.json");

const firebaseApp = firebase.initializeApp(firebaseConfig);
firebaseApp.analytics();

export default firebaseApp;
