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
  createCountdown(expireDate) {
    let now = Date.now() / 1000,
      expiresAt = expireDate,
      diff = expiresAt - now,
      countdown;
    if (diff > 0) {
      var d = Math.floor(diff / 86400),
        h = Math.floor((diff - d * 86400) / 3600),
        h = h < 10 ? `0${h}` : h,
        m = Math.floor((diff - d * 86400 - h * 3600) / 60),
        m = m < 10 ? `0${m}` : m,
        s = Math.floor(diff - d * 86400 - h * 3600 - m * 60),
        s = s < 10 ? `0${s}` : s;
      if (d !== 0) {
        countdown =
          d > 1
            ? `Verbleibende Zeit: ${d} Tage & ${h}:${m}:${s}`
            : `Verbleibende Zeit: ${d} Tag & ${h}:${m}:${s}`;
      } else {
        countdown = `Verbleibende Zeit: ${h}:${m}:${s}`;
      }
    } else {
      countdown = "Das Angebot ist nicht mehr verfügbar";
    }
    return countdown;
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
