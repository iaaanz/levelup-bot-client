class routes {
  constructor(base, username, password) {
    if (!base) throw new Error('Invalid base URL..');
    if (!username) throw new Error('Invalid username..');
    if (!password) throw new Error('Invalid password..');
    // Modules
    this.request = require('request');

    // class data
    this.base = base;
    this.username = username;
    this.password = password;
    this.routes = {
      lolchatv1me: '/lol-chat/v1/me',
      lolmatchmakingv1readycheck: '/lol-matchmaking/v1/ready-check',
      lolmatchmakingv1readycheckaccept: '/lol-matchmaking/v1/ready-check/accept',
      lollobbyv2receivedinvitations: '/lol-lobby/v2/received-invitations',
      lolsummonerv1currentsummoner: '/lol-summoner/v1/current-summoner',
      lolrankedstatsv1statsByID: '/lol-ranked-stats/v1/stats/',
    };
    this.alias = {
      // lolchatv1me
      reset: this.routes.lolchatv1me,
      submitTierDivison: this.routes.lolchatv1me,
      submitLevel: this.routes.lolchatv1me,
      submitStatus: this.routes.lolchatv1me,
      submitLeagueName: this.routes.lolchatv1me,
      submitAvailability: this.routes.lolchatv1me,
      submitIcon: this.routes.lolchatv1me,
      submitSummoner: this.routes.lolchatv1me,
      submitWinsLosses: this.routes.lolchatv1me,

      // lolmatchmakinv1readycheck
      autoAccept: this.routes.lolmatchmakingv1readycheck,
      accept: this.routes.lolmatchmakingv1readycheckaccept,

      // lolsummonerv1currentsummoner
      localSummoner: this.routes.lolsummonerv1currentsummoner,

      // lollobbyv2receivedinvitations
      invDecline: this.routes.lollobbyv2receivedinvitations,

      // lolrankedstatsv1statsByID:
      getRankedStats(instance, id) {
        return instance.routes.lolrankedstatsv1statsByID + id;
      },
    };
  }

  setAPIBase(base) {
    this.base = base;
  }

  getAPIBase() {
    return this.base;
  }

  get(body, callback) {
    body.url = this.base + body.url;
    return this.request.get(body, callback);
  }

  post(body, callback) {
    body.url = this.base + body.url;
    return this.request.post(body, callback);
  }

  put(body, callback) {
    body.url = this.base + body.url;
    return this.request.put(body, callback);
  }

  getAuth() {
    return `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
  }

  Route(alias, id) {
    const route = id ? this.alias[alias](this, id) : this.alias[alias];
    if (!route) throw new Error('Invalid alias.');
    // console.log("Route is: " + route)
    return this.base + route;
  }
}

module.exports = routes;
