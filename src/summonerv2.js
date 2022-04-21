class SummonerV2 {
  constructor(data, RiotAPI) {
    this.RiotAPI = RiotAPI;
    this.level = this.level || data.summonerLevel;
    this.name = this.name || data.displayName;
    this.ID = this.ID || data.summonerId;
    this.iconID = this.iconID || data.profileIconId;
  }

  receivedRankedStats = (data) => {
    if (data) {
      this.rankedDivision = data.division !== 'NA' ? data.division : 'unranked';
      this.rankedTier = data.tier !== 'NONE' ? data.tier : '';
      // this.wins = rankedData.wins;
      // this.leagueName = data.tier;
      // this.rankedQueue = data.rankedQueue;
      // this.lp = rankedData.lp;
    }
  };

  getProfileData = async () => {
    await this.getRankedStats();

    return {
      name: this.name,
      iconID: this.iconID,
      leagueName: this.leagueName,
      leagueWins: this.wins,
      rankedData: `${this.rankedTier} ${this.rankedDivision}`,
      level: this.level,
    };
  };

  getRankedStats = async () => {
    const rankedUrl = this.RiotAPI.route('lolRankedStatsV1StatsByID');
    const { data } = await this.RiotAPI.instance.get(rankedUrl);
    const rankedData = data.queueMap.RANKED_SOLO_5x5;

    this.receivedRankedStats(rankedData);
  };

  returnRomanDivision = (division) => {
    division.toString();
    if (division === '1') return 'I';
    if (division === '2') return 'II';
    if (division === '3') return 'III';
    if (division === '4') return 'IV';
    if (division === '5') return 'V';
    return '';
  };
}

module.exports = SummonerV2;
