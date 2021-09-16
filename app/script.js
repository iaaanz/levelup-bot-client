/* eslint-disable no-console */
const { ipcRenderer } = require('electron');

let gameVersion;
let summoner;

const exitApp = () => {
  ipcRenderer.send('exit_app');
};

const minimizeApp = () => {
  ipcRenderer.send('minimize_app');
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

/*
    SECTIONS
*/

function openTab(evt, tabName) {
  // Declare all variables
  let i;
  let tabcontent;
  let tablinks;

  if (tabName == 'Home') {
    document.getElementById('selected').style.marginLeft = '0px';
  }

  if (tabName == 'Profile') {
    document.getElementById('selected').style.marginLeft = '120px';
  }

  if (tabName == 'Champ Select') {
    document.getElementById('selected').style.marginLeft = '278px';
  }

  if (tabName == 'Miscellaneous') {
    document.getElementById('selected').style.marginLeft = '473px';
  }

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName('tabcontent');
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none';
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName('tablinks');
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' active', '');
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = 'block';
  evt.currentTarget.className += ' active';
}

const autoUpdate = () => {
  setInterval(() => {
    profileUpdate();
  }, 5000);
};

autoUpdate();

ipcRenderer.send('requestVersionCheck');
setInterval(() => {
  ipcRenderer.send('requestVersionCheck');
}, 30000);

function openGithub() {
  ipcRenderer.send('openGitRepository');
}

ipcRenderer.on('versions', (event, leagueGameVersion) => {
  gameVersion = leagueGameVersion;
});
