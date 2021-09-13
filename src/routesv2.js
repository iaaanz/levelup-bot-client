class RoutesV2 {

  constructor(base, username, password) {
    if (!base) throw "Invalid base URL";
    if (!username) throw "Invalid username";
    if (!password) throw "Invalid password";

    this.base = base;
    this.username = username;
    this.password = password;
    this.routes = {
      lolchatv1me: "/lol-chat/v1/me",
      lolmatchmakingv1readycheck: "/lol-matchmaking/v1/ready-check",
      lolmatchmakingv1readycheckaccept: "/lol-matchmaking/v1/ready-check/accept",
      lollobbyv2receivedinvitations: "/lol-lobby/v2/received-invitations",
      lolSummonerV1CurrentSummoner: "/lol-summoner/v1/current-summoner",
      lolRankedStatsV1StatsByID: "/lol-ranked/v1/current-ranked-stats",
    }
  }

  setAPIBase(base) {
    this.base = base;
  }

  getAPIBase() {
    return this.base;
  }

  getAuth() {
    return "Basic " + (new Buffer(this.username + ":" + this.password).toString("base64"));
  }

  route(routeName, id) {
    let route = id ? this.routes[routeName](this, id) : this.routes[routeName];
    if (!route) throw "Invalid alias.";
    return this.base + route;
  }
}

module.exports = RoutesV2;