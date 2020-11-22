export default class ReallifeRPG {
  constructor() {
    this.host = "https://api.realliferpg.de/v1/";
  }

  /**
   * Get an player profile from ReallifeRPG
   * @param {string} apiKey ReallifeRPG API-Key
   */
  async getPlayer(apiKey) {
    const response = await fetch(`https://api.realliferpg.de/v1/player/${apiKey}`);
    const playerData = await response.json();
    return playerData;
  }
}
