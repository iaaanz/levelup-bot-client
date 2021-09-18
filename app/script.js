/* eslint-disable no-console */
const { ipcRenderer } = require('electron');
const $ = require('jQuery');
const championsJson = require('../src/champions.json');

const champCombo1 = document.getElementById('champ1');
const champCombo2 = document.getElementById('champ2');
const champCombo3 = document.getElementById('champ3');
let gameVersion;
let summoner;

const exitApp = () => {
  ipcRenderer.send('exitApp');
};

const minimizeApp = () => {
  ipcRenderer.send('minimizeApp');
};

const setChampion = () => {
  let opt;
  const { champions } = championsJson;
  const champName = Object.getOwnPropertyNames(champions);
  const champCount = Object.keys(champions).length;
  for (let i = 0; i < champCount; i += 1) {
    opt = document.createElement('option');
    opt.value = champions[champName[i]];
    opt.innerHTML = champName[i];
    champCombo1.appendChild(opt.cloneNode(true));
    champCombo2.appendChild(opt.cloneNode(true));
    champCombo3.appendChild(opt.cloneNode(true));
  }
};

const profileUpdate = () => {
  ipcRenderer
    .invoke('profileUpdate')
    .then((res) => {
      const data = res;
      if (data === 'Updating') {
        console.log('vaziu / updating');
        document.getElementById('profileName').innerHTML = 'Updating...';
        document.getElementById('profileRankedTier').innerHTML = 'Updating...';
        return;
      }

      if (data === 'Offline') {
        document.getElementById('profileSummonerIcon').src = 'assets/ui/default_icon.png';
        document.getElementById('profileName').innerHTML = 'Is not logged in';
        document.getElementById('profileRankedTier').innerHTML = 'Unranked';
        document.getElementById('profileLevel').innerHTML = '--';
      } else {
        const { iconID, rankedData, level, name } = data;
        const rankedTier = rankedData || document.getElementById('profileRankedTier').innerHTML;
        const profileLevel = level || document.getElementById('profileWL').innerHTML;

        document.getElementById('profileName').innerHTML = summoner || name;
        document.getElementById('profileRankedTier').innerHTML = rankedTier;
        document.getElementById('profileLevel').innerHTML = level || profileLevel;
        document.getElementById(
          'profileSummonerIcon'
        ).src = `http://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/profileicon/${
          iconID || '1'
        }.png`;
      }
    })
    .catch((err) => {
      console.log(`And error occured updating the profile information: ${err}`);
    });
};

const autoUpdate = () => {
  setInterval(() => {
    profileUpdate();
  }, 5000);
};

// eslint-disable-next-line no-unused-vars
const saveConfiguration = () => {
  const botConfig = {
    lol_path: '',
    gamemode: '',
    champ1: '',
    champ2: '',
    champ3: '',
    // user: '',
    // senha: '',
  };
  ipcRenderer.send('saveConfiguration', botConfig);
};

// eslint-disable-next-line no-unused-vars
const selectDir = () => {
  ipcRenderer.send('select-dirs');
};

ipcRenderer.send('requestVersionCheck');

setInterval(() => {
  ipcRenderer.send('requestVersionCheck');
}, 30000);

ipcRenderer.on('versions', (event, leagueGameVersion) => {
  gameVersion = leagueGameVersion;
});

autoUpdate();
setChampion();
