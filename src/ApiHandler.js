import { avatar } from "./config.json";

class User {
  /**
   * Get an avatar-url by the username
   * @param {string} username
   * @returns {string} eu.ui-avatars.com
   */
  getAvatar(username) {
    return `https://eu.ui-avatars.com/api/?name=${username}&size=${avatar.size}&background=${avatar.background}&color=${avatar.color}`;
  }
}

class Offer {}

class Auction extends Offer {}

export { User, Offer, Auction };
