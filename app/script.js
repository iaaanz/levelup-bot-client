const { ipcRenderer } = require('electron');

let gameVersion;
let isActive;
let level;
let icon;
let summoner;

function exit_app() {
  ipcRenderer.send('exit_app');
}

function minimize_app() {
  ipcRenderer.send('minimize_app');
}

async function profileUpdate() {
  try {
    const data = ipcRenderer.sendSync('profileUpdate');
    let { clientIcon } = data;
    if (!data || !data.name) return;
    if (clientIcon) {
      if (clientIcon !== data.iconID) {
        document.getElementById(
          'profileSummonerIcon'
        ).src = `http://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/profileicon/${data.iconID}.png`;
        clientIcon = data.iconID;
      }
    } else {
      const rankedData = data.rankedData || document.getElementById('profileRankedTier').innerHTML;
      const profileLevel = data.level || document.getElementById('profileWL').innerHTML;
      // document.getElementById("profileLeagueName").innerHTML =
      // (leagueName != undefined) ? leagueName : "";
      document.getElementById('profileName').innerHTML = summoner || data.name;
      document.getElementById('profileRankedTier').innerHTML = rankedData;
      document.getElementById('profileLevel').innerHTML = level || profileLevel;
      document.getElementById(
        'profileSummonerIcon'
      ).src = `http://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/profileicon/${
        icon || data.iconID || '1'
      }.png`;
    }
  } catch (e) {
    console.erro(`And error occured updating the profile information: ${e}`);
  }
}

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

// TODO: Refatorar !!!
function autoUpdate() {
  isActive = true;
  setTimeout(() => {
    setInterval(() => {
      if (!isActive) return;
      profileUpdate();
    }, 5000);
    profileUpdate();
  }, 2000);
}

window.addEventListener('load', autoUpdate, false);

window.onfocus = function () {
  isActive = true;
};

window.onblur = function () {
  isActive = false;
};

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
