/* eslint-disable no-console */
const { ipcRenderer } = require('electron');
const $ = require('jQuery');
const championsJson = require('../src/champions.json');

let gameVersion;

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
    $('#champ1').append(opt.cloneNode(true));
    $('#champ2').append(opt.cloneNode(true));
    $('#champ3').append(opt.cloneNode(true));
  }
};

const profileUpdate = () => {
  ipcRenderer
    .invoke('profileUpdate')
    .then((res) => {
      const data = res;
      if (data === 'Updating') {
        $('#profileName').text('Updating...');
        $('#profileRankedTier').text('Updating...');
        return;
      }

      if (data === 'Offline') {
        $('#profileSummonerIcon').attr('src', 'assets/ui/default_icon.png');
        $('#profileName').text('Is not logged in');
        $('#profileRankedTier').text('Unranked');
        $('#profileLevel').text('--');
      } else {
        const { iconID, rankedData, level, name } = data;
        const rankedTier = rankedData || $('#profileRankedTier').text();

        $('#profileName').text(name);
        $('#profileRankedTier').text(rankedTier);
        $('#profileLevel').text(level);
        $('#profileSummonerIcon').attr(
          'src',
          `http://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/profileicon/${
            iconID || '1'
          }.png`
        );
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
