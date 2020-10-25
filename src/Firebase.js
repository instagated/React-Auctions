import firebase from "firebase";

const { firebaseConfig } = require("./config.json");
const firebaseApp = firebase.initializeApp(firebaseConfig);
const firestore = firebaseApp.firestore();
firebaseApp.analytics();

export { firestore };
export default firebaseApp;
