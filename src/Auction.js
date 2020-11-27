import Firebase, { firestore } from "./Firebase";

export default class Auction {
  /**
   * Get avatar by username from eu-avatars
   * @param {string} username
   */
  getAvatar(username) {
    let avatar = `https://eu.ui-avatars.com/api/?name=${username}&size=256&background=fff&color=212529`;
    return avatar;
  }

  /**
   * Get an list of all offers create by an specific user
   * @param {string} uid Firebase Authentification uid
   */
  getUserOffers(uid) {
    return new Promise((res, rej) => {
      firestore
        .collection("user")
        .doc(uid)
        .get()
        .then((doc) => res(doc.data().offers))
        .catch((err) => rej(err));
    });
  }

  /**
   * @param {number} expireDate
   */
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

  /**
   * @param {string} user Firebase Authentification userId
   * @param {string} offer Document id which includes the offer data
   */
  registerOffer(user, offer) {
    return new Promise((res, rej) => {
      firestore
        .collection("user")
        .doc(user)
        .get()
        .then((docRef) => {
          let offerList = docRef.data().offers;
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
   */
  uploadProductImages(offer, productImages) {
    return new Promise((res, rej) => {
      var images = [];
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
              if (i == productImages.length - 1) res(images);
            });
          }
        );
      }
    });
  }

  /**
   * Create an new offer
   * @param {string} offerData
   * @param {File} thumbnail
   * @param {FileList} productImages
   */
  createOffer(offerData, thumbnail, productImages) {
    return new Promise((res, rej) => {
      const offerRef = firestore.collection("offers").doc(),
        offerId = offerRef.id,
        uploadThumbnail = new Auction().uploadThumbnail(offerId, thumbnail),
        uploadProductImages = new Auction().uploadProductImages(offerId, productImages),
        img = { thumbnail: null, product: null };

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
              new Auction().registerOffer(Firebase.auth().currentUser.uid, offerId);
            })
            .catch((err) => rej(err));
        })
        .catch((err) => rej(err));
    });
  }

  /**
   * Delete an offer
   * @param {string} offer Document Id
   */
  deleteOffer(offer) {
    return new Promise((res, rej) => {
      let response = {
        success: null,
        status: null,
        message: null,
      };

      firestore
        .collection("offers")
        .doc(offer)
        .get()
        .then((doc) => {
          const offerData = doc.data(),
            seller = offerData.seller;
          offerData.id = doc.id;
          // Check if the document was already sold or if it's an auction if there is already an bid
          // If the offer was already sold offer.bought should return an object
          // TODO Check if the offer already received an bid
          if (offerData.bought === undefined) {
            const deleteDocument = firestore.collection("offers").doc(offerData.id).delete();
            const updateProfile = firestore
              .collection("user")
              .doc(seller.id)
              .get()
              .then((docRef) => {
                let offerList = docRef.data().offers;
                let newList = offerList.filter((offerId) => offerId !== offer);
                firestore.collection("user").doc(seller.id).update({
                  offers: newList,
                });
              });

            Promise.all([deleteDocument, updateProfile])
              .then((results) => {
                response = {
                  success: true,
                  status: 2,
                  message: "Das Angebot wurde gelöscht",
                };
                res(response);
              })
              .catch((err) => {
                console.error(err);
                response = {
                  success: false,
                  status: 5,
                  message: "Etwas ist schiefgelaufen",
                };
                rej(response);
              });
          } else {
            // The offer was already sold and can't be deleted
            response = {
              success: false,
              status: 5,
              message: "Das Angebot wurde bereits verkauft",
            };
            rej(response);
          }
        });
    });
  }
}
