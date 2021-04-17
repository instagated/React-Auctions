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
   *
   * @param {string} user
   * @param {string} offer
   * @returns {Promise}
   */
  create(user, offer) {
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
    const offer = await offerRef.get().data();
    const seller = offer.seller;
    const sellerRef = firestore.collection("user").doc(seller);

    // Check if the offer already got bought by an user
    if (offer.bought === undefined) {
      await offerRef.delete();
      var offerList = await sellerRef.get().data().offers;
      var newList = offerList.filter((offer) => offerId !== offer);
      await sellerRef.update({ offers: newList });

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

    var offerUpdate = offerRef.update({
      bought: { user: userRef, uid: userId, username: userData.username, at: new Date() },
    });
    var userUpdate = userRef.update({ bought: boughtList });

    return { offer: offerUpdate, user: userUpdate };
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
