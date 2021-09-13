class SummonerV2 {

	constructor(data, RiotAPI) {
		this.axios = require('axios');
    this.https = require('https');

		this.RiotAPI = RiotAPI;
		this.level = this.level || data.summonerLevel;
		this.name = this.name || data.displayName;
		this.ID = this.ID || data.summonerId;
		this.iconID = this.iconID || data.profileIconId;
		this.getRankedStats();
	}

  compareRanks = (r1, r2) => {
    let highestRank;

    let leagues = {
      "BRONZE" 		: 1, 
      "SILVER" 		: 2, 
      "GOLD" 			: 3, 
      "PLATINUM" 		: 4, 
      "DIAMOND" 		: 5, 
      "MASTER" 		: 6, 
      "CHALLENGER" 	: 7
    };

    let league1 = leagues[r1.rankedTier], 
      league2 = leagues[r2.rankedTier];

    if (league1 > league2) {
      highestRank = r1;
    } else if (league2 > league1) {
      highestRank = r2;
    } else { // same league
      if (r1.division < r2.division) { // r1 is higher (diamond 1 higher than diamond 5)
        highestRank = r1;
      } else if (r1.division > r2.division) {
        highestRank = r2;
      } else { // same division
        if (r1.lp > r2.lp) {
          highestRank = r1;
        } else {
          highestRank = r2;
        }
      }
    }

    return highestRank;
  }

  // getHighestRank = (ranks) => {
  //   let highestRank;
  //   for (let i = 0; i < ranks.length; i++) {
  //     let rankedData = ranks[i];
  //     let division = rankedData.division;
  //     let leagueName = rankedData.leagueName;

  //     if (!highestRank) highestRank = rankedData;
  //     highestRank = this.compareRanks(highestRank, rankedData);
  //   }

  //   return highestRank;
  // }

  receivedRankedStats = (data) => {
    if (data) { 
      // this.division = this.returnRomanDivision(rankedData.division);
      this.division = data.division;
      // this.wins = rankedData.wins;
      this.rankedTier = data.tier;
      // this.leagueName = data.tier;
      // this.rankedQueue = data.rankedQueue;
      // this.lp = rankedData.lp;
    }
  }

	getProfileData = () => {
		let arr = {
			name: this.name,
			iconID: this.iconID,
			leagueName: this.leagueName,
			leagueWins: this.wins,
			rankedDivision: this.rankedTier + " " + this.division,
			level: this.level
		}
		return arr
	}

  getRankedStats = async () => {
    let rankedUrl = this.RiotAPI.route("lolRankedStatsV1StatsByID");
    console.log('rankedUrl: ' + rankedUrl);
    const instance = this.axios.create({
      httpsAgent: new this.https.Agent({  
        rejectUnauthorized: false
      }),
      headers: {
        Authorization: this.RiotAPI.getAuth(),
      }
    });
    await instance
      .get(rankedUrl)
      .then(res => {
        let data = res.data['queueMap']['RANKED_SOLO_5x5'];
        this.receivedRankedStats(data);
      })
      .catch(err => {
        console.log(err);
      });  
    // let callback = (error, response, body) => {
    //   if (!response) return;
    //   if (response.statusCode == 200) {
    //     body = JSON.parse(body);
    //     this.receivedRankedStats(body);
    //   }
    // }
    // this.request.get(body, callback);
  }

  returnRomanDivision = (division) => {
    division.toString();
    if (division == "1") return "I";
    if (division == "2") return "II";
    if (division == "3") return "III";
    if (division == "4") return "IV";
    if (division == "5") return "V";
    return "";
  }

}
module.exports = SummonerV2;
