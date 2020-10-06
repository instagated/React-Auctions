import Firebase from "./Firebase";

export default class Auction {
  /**
   * @param {number} userId
   */
  getSeller(userId) {
    return new Promise((res, rej) => {
      Firebase.database()
        .ref(`auction_user/${userId}`)
        .on(
          "value",
          (response) => {
            res(response.val());
          },
          (error) => {
            rej(error);
          }
        );
    });
  }

  /**
   * Get avatar by username from eu-avatars
   * @param {string} username
   */
  getAvatar(username) {
    let avatar = `https://eu.ui-avatars.com/api/?name=${username}&size=256&background=fff&color=212529`;
    return avatar;
  }

  getOffers() {
    return new Promise((res, rej) => {
      Firebase.database()
        .ref("auction_offers")
        .on(
          "value",
          (response) => {
            res(response.val());
          },
          (error) => {
            rej(error);
          }
        );
    });
  }

  /**
   * @param {number} offerId
   */
  getOffer(offerId) {
    return new Promise((res, rej) => {
      Firebase.database()
        .ref(`auction_offers/${offerId}`)
        .on(
          "value",
          (response) => {
            res(response.val());
          },
          (error) => {
            rej(error);
          }
        );
    });
  }
}
