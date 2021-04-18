import Firebase, { firestore } from "./Firebase";

class User {
  /**
   *
   * @param {string} user Firestore document-id
   * @returns {string} username
   */
  async getUsername(userId) {
    const userRef = await firestore.collection("user").doc(userId).get();
    const userData = userRef.data();
    const username = userData.username;
    return username;
  }

  /**
   * Get avatar-url by username from eu-avatars
   * @param {string} username
   * @returns {string} avatar url
   */
  getAvatar(username) {
    return `https://eu.ui-avatars.com/api/?name=${username}&size=256&background=fff&color=212529`;
  }

  /**
   *
   * @param {string} userId
   * @returns {object}
   */
  async get(userId) {
    // TODO Use Firebase Admin SDK to get an reigstered user from Firebase Authentification
    var userDocument = await firestore.collection("user").doc(userId).get();
    var userData = userDocument.data();
    return userData;
  }

  updatePassword() {}

  /**
   * Check if an user is signed in
   * @returns {Boolean}
   */
  isSignedIn() {
    var user = Firebase.auth().currentUser;
    return user ? true : false;
  }
}

class Offer {
  /**
   * Create an new offer
   * @param {object} offerData
   * @param {File} thumbnail
   * @param {FileList} productImages
   * @returns {Promise}
   */
  create(offerData, thumbnail, productImages) {
    return new Promise((res, rej) => {
      const offerRef = firestore.collection("offers").doc();
      const offerId = offerRef.id;
      var uploadThumbnail = this.uploadThumbnail(offerId, thumbnail);
      var uploadProductImages = this.uploadProductImages(offerId, productImages);
      var img = { thumbnail: null, product: null };

      Promise.all([uploadThumbnail, uploadProductImages])
        .then((results) => {
          img.thumbnail = results[0];
          img.product = results[1];
          offerData.images = img;
          firestore
            .collection("offers")
            .doc(offerId)
            .set(offerData)
            .then((docRef) => {
              res(docRef);
              // this.createOfferDocument(Firebase.auth().currentUser.uid, offerId);
            })
            .catch((err) => rej(err));
        })
        .catch((err) => rej(err));
    });
  }

  /**
   * Create an Firestore document for the offer containg all required data
   * @deprecated The offer aren't registered anymore in the user document. Use an Firestore where-query instead to receive the registered offers using an userId
   * @param {string} user
   * @param {string} offer
   * @returns {Promise}
   */
  createOfferDocument(user, offer) {
    return new Promise((res, rej) => {
      firestore
        .collection("user")
        .doc(user)
        .get()
        .then((docRef) => {
          var offerList = docRef.data().offers;
          offerList.push(offer);
          firestore.collection("user").doc(user).update({
            offers: offerList,
          });
          res(offerList);
        })
        .catch((err) => rej(err));
    });
  }

  /**
   * Upload the offer thumbnail up to our Firebase Storage
   * @param {string} offer Document Id
   * @param {File} thumbnail
   * @returns {Promise}
   */
  uploadThumbnail(offer, thumbnail) {
    return new Promise((res, rej) => {
      const thumbnailRef = Firebase.storage().ref(`offers/${offer}/thumbnail/${thumbnail.name}`),
        uploadThumbnail = thumbnailRef.put(thumbnail);

      // Upload the thumbnail
      uploadThumbnail.on(
        "state_changed",
        function progress(snapshot) {
          // Do something...
        },
        function error(err) {
          rej(err);
        },
        function complete() {
          thumbnailRef.getDownloadURL().then((url) => res(url));
        }
      );
    });
  }

  /**
   * Upload the product-images in our Firebase Storage
   * @param {string} offer Document Id
   * @param {FileList} productImages
   * @returns {Promise}
   */
  uploadProductImages(offer, productImages) {
    return new Promise((res, rej) => {
      var images = [];
      if (productImages.length > 0) {
        for (let i = 0; i < productImages.length; i++) {
          const image = productImages[i];
          const imageRef = Firebase.storage().ref(`offers/${offer}/product/${image.name}`);
          const task = imageRef.put(image);
          task.on(
            "state_changed",
            function progress(snapshot) {
              // Do something...
            },
            function error(error) {
              rej(error);
            },
            function complete(event) {
              imageRef.getDownloadURL().then((url) => {
                images.push(url);
                if (i === productImages.length - 1) res(images);
              });
            }
          );
        }
      } else {
        res(null);
      }
    });
  }

  /**
   *
   * @param {string} offerId
   * @returns {object}
   */
  async get(offerId) {
    var offerRef = firestore.collection("offers").doc(offerId);
    var offerDocument = await offerRef.get();
    var offerData = offerDocument.data();
    if (offerData.bought !== undefined) {
      var buyerId = offerData.bought.user.id;
      var buyerUsername = await new User().getUsername(buyerId);
      offerData.bought.username = buyerUsername;
    }
    return offerData;
  }

  /**
   *
   * @param {string} offerId
   * @returns {object}
   */
  async delete(offerId) {
    var response = { success: false, message: null };
    const offerRef = firestore.collection("offers").doc(offerId);
    const offerDocument = await offerRef.get();
    const offerData = offerDocument.data();
    // const sellerRef = offerData.seller;
    var gotBought = offerData.bought !== undefined;

    // Check if the offer already got bought by an user
    if (!gotBought) {
      await offerRef.delete();
      // var offerList = await sellerRef.get().data().offers;
      // var newList = offerList.filter((offer) => offerId == offer);
      // await sellerRef.update({ offers: newList });
      response.success = true;
      response.message = "Das Angebot wurde gelöscht";
    } else {
      response.message = "Das Angebote wurde bereits verkauft";
    }

    return response;
  }

  /**
   *
   * @param {string} offerId
   * @param {string} userId
   * @returns {object}
   */
  async buy(offerId, userId) {
    const offerRef = firestore.collection("offers").doc(offerId);
    const userRef = firestore.collection("user").doc(userId);
    const userDoc = await userRef.get();
    var userData = userDoc.data();
    var boughtList = userData.bought;

    // TODO Check if the reference is still required or are we using an where-query to get the bought offers by an user
    var offerUpdate = await offerRef.update({
      bought: { user: userRef, uid: userId, username: userData.username, at: new Date() },
    });
    var userUpdate = await userRef.update({ bought: boughtList });

    return { offer: offerUpdate, user: userUpdate };
  }

  /**
   *
   * @param {number} expireDate
   * @returns {string}
   */
  createCountdown(expireDate) {
    const now = Date.now() / 1000;
    var expiresAt = expireDate;
    var diff = expiresAt - now;
    var countdown;
    if (diff > 0) {
      var d = Math.floor(diff / 86400),
        h = Math.floor((diff - d * 86400) / 3600),
        hours = h < 10 ? `0${h}` : h,
        m = Math.floor((diff - d * 86400 - h * 3600) / 60),
        minutes = m < 10 ? `0${m}` : m,
        s = Math.floor(diff - d * 86400 - h * 3600 - m * 60),
        seconds = s < 10 ? `0${s}` : s;
      if (d !== 0) {
        countdown =
          d > 1
            ? `Verbleibende Zeit: ${d} Tage & ${hours}:${minutes}:${seconds}`
            : `Verbleibende Zeit: ${d} Tag & ${hours}:${minutes}:${seconds}`;
      } else {
        countdown = `Verbleibende Zeit: ${hours}:${minutes}:${seconds}`;
      }
    } else {
      countdown = "Das Angebot ist nicht mehr verfügbar";
    }
    return countdown;
  }
}

class Auction extends Offer {
  isAuction(offer) {
    var offerType = offer.type;
    return offerType == 1 ? true : false;
  }

  bid(offer, user, bid) {}

  getBids(offer) {}
}

export { User, Offer };
