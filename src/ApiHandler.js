import { avatar } from "./config.json";
import { firestore } from "./Firebase";

class User {
  /**
   * Get an avatar-url by the username
   * @param {string} username
   * @returns {string} eu.ui-avatars.com
   */
  getAvatar(username) {
    return `https://eu.ui-avatars.com/api/?name=${username}&size=${avatar.size}&background=${avatar.background}&color=${avatar.color}`;
  }

  async getUsername(userId) {
    var userRef = await firestore.collection("user").doc(userId).get();
    var userData = userRef.data();
    var username = userData.username;
    return username;
  }
}

class Offer {
  /**
   * Update offers & user document
   * @param {object} offer
   * @param {object} user
   * @returns {Promise}
   */
  buy(offer, user) {
    return new Promise((res, rej) => {
      firestore
        .collection("offers")
        .doc(offer)
        .update({
          bought: { uid: user.id, user: user, at: new Date() },
        })
        .then(() => {
          firestore
            .collection("user")
            .doc(user)
            .get()
            .then((docRef) => {
              let offerList = docRef.data().bought;
              offerList.push(offer);
              firestore.collection("user").doc(user).update({
                bought: offerList,
              });
              res(offerList);
            });
        })
        .catch((err) => rej(err));
    });
  }
}

class Auction extends Offer {}

export { User, Offer, Auction };
