class summoner {
  constructor(data, APIRoutes) {
    // Modules
    this.request = require('request');

    // class data

    if (!this.IsJsonString(data)) return;
    data = JSON.parse(data);
    this.APIRoutes = APIRoutes;
    this.level = this.level || data.summonerLevel;
    this.name = this.name || data.displayName;
    this.ID = this.ID || data.summonerId;
    this.iconID = this.iconID || data.profileIconId;
    this.getRankedStats();
  }

  compareRanks(r1, r2) {
    let highestRank;

    const leagues = {
      BRONZE: 1,
      SILVER: 2,
      GOLD: 3,
      PLATINUM: 4,
      DIAMOND: 5,
      MASTER: 6,
      CHALLENGER: 7,
    };

    const league1 = leagues[r1.rankedTier];
    const league2 = leagues[r2.rankedTier];

    if (league1 > league2) {
      highestRank = r1;
    } else if (league2 > league1) {
      highestRank = r2;
    } else {
      // same league
      if (r1.division < r2.division) {
        // r1 is higher (diamond 1 higher than diamond 5)
        highestRank = r1;
      } else if (r1.division > r2.division) {
        highestRank = r2;
      } else {
        // same division
        if (r1.lp > r2.lp) {
          highestRank = r1;
        } else {
          highestRank = r2;
        }
      }
    }

    return highestRank;
  }

  getHighestRank(ranks) {
    let highestRank;
    for (let i = 0; i < ranks.length; i++) {
      const rankedData = ranks[i];
      const { division } = rankedData;
      const { leagueName } = rankedData;

      if (!highestRank) highestRank = rankedData;
      highestRank = this.compareRanks(highestRank, rankedData);
    }

    return highestRank;
  }

  receivedRankedStats(data) {
    const rankedData = this.getHighestRank(data.rankedData);

    if (rankedData) {
      // Checking if summoner is unranked
      this.division = this.returnRomanDivision(rankedData.division);
      this.wins = rankedData.wins;
      this.rankedTier = rankedData.rankedTier;
      this.leagueName = rankedData.leagueName;
      this.rankedQueue = rankedData.rankedQueue;
      this.lp = rankedData.lp;
    }
  }

  IsJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  getProfileData() {
    const arr = {
      name: this.name,
      iconID: this.iconID,
      leagueName: this.leagueName,
      leagueWins: this.wins,
      rankedTier: `${this.rankedTier} ${this.division}`,
      level: this.level,
    };
    return arr;
  }

  getRankedStats() {
    const rankedUrl = this.APIRoutes.Route('getRankedStats', this.ID);
    const body = {
      url: rankedUrl,
      rejectUnauthorized: false,
      headers: {
        Authorization: this.APIRoutes.getAuth(),
      },
    };
    const callback = (error, response, body) => {
      if (!response) return;
      if (response.statusCode == 200) {
        body = JSON.parse(body);
        this.receivedRankedStats(body);
      }
    };
    this.request.get(body, callback);
  }

  returnRomanDivision(division) {
    division.toString();
    if (division == '1') return 'I';
    if (division == '2') return 'II';
    if (division == '3') return 'III';
    if (division == '4') return 'IV';
    if (division == '5') return 'V';
    return '';
  }

  reset() {
    console.log('Starting reset.');
    const url = this.APIRoutes.Route('reset');
    const body = {
      url,
      rejectUnauthorized: false,
      headers: {
        Authorization: this.APIRoutes.getAuth(),
      },
      json: {
        availability: 'chat',
        icon: this.iconID,
        id: this.ID,
        lastSeenOnlineTimestamp: new Date().getTime().toString(),
        lol: {
          level: this.level.toString(),
          mapId: '',
          rankedLeagueDivision: this.returnRomanDivision(this.division),
          rankedLeagueName: this.leagueName,
          rankedLeagueQueue: this.rankerQueue,
          rankedLeagueTier: this.rankedTier,
          rankedLosses: '0',
          rankedWins: this.wins.toString(),
        },
        name: this.name,
        // "statusMessage": "Most dedicated support player EUW!"
      },
    };
    const callback = function (error, response, body) {
      // console.log('error:', error);
      // console.log('statusCode:', response && response.statusCode);
      // console.log('body:', body);
    };
    this.request.put(body, callback);
  }
}

module.exports = summoner;
