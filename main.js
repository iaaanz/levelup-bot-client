/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const { app, BrowserWindow, ipcMain } = require('electron');
const LCUConnector = require('lcu-connector');

const connector = new LCUConnector();
const axios = require('axios');
const https = require('https');
const request = require('request');
const RoutesV2 = require('./src/routesv2');
const SummonerV2 = require('./src/summonerv2');

app.commandLine.appendSwitch('ignore-certificate-errors');

let LocalSummoner;
let RiotAPI;

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    frame: false,
    title: 'League LevelUp',
    width: 1280,
    height: 720,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  mainWindow.loadFile('./app/index.html');
  mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// const mainMenuTemplate = [
//   {
//     label: 'File',
//     submenu: [],
//   },
// ];

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('exit_app', () => {
  app.quit();
});

ipcMain.on('minimize_app', () => {
  mainWindow.minimize();
});

ipcMain.on('requestVersionCheck', (event) => {
  request('https://ddragon.leagueoflegends.com/api/versions.json', (error, response, body) => {
    const data = JSON.parse(body);
    event.sender.send('versions', data[0]);
  });
});

const formattedData = (data) => {
  const riotToken = {
    riotToken: `Basic ${Buffer.from(`${data.username}:${data.password}`).toString('base64')}`,
  };
  const baseUrl = {
    baseUrl: `${data.protocol}://${data.address}:${data.port}`,
  };

  return Object.assign(data, riotToken, baseUrl);
};

const getLocalSummoner = async () => {
  const instance = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
    headers: {
      Authorization: RiotAPI.getAuth(),
    },
  });

  await instance
    .get(RiotAPI.route('lolSummonerV1CurrentSummoner'))
    .then((res) => {
      if (res.status === 200) {
        LocalSummoner = new SummonerV2(res.data, RiotAPI);
        return LocalSummoner;
      }

      return false;
    })
    .catch(() => {
      console.log('getLocalSummoner / .catch()');
    });
};

ipcMain.handle('profileUpdate', async () => {
  if (!RiotAPI) return 'Offline';
  getLocalSummoner();
  if (!LocalSummoner) return 'Updating';
  const result = await LocalSummoner.getProfileData();
  return result;
});

connector.start();

connector.on('connect', (data) => {
  const riotData = formattedData(data);
  RiotAPI = new RoutesV2(riotData.baseUrl, riotData.username, riotData.password);
  console.log('League Client has started:');
  console.log(riotData);
  console.log(`Request base URL: ${RiotAPI.getAPIBase()}`);
  getLocalSummoner();
});

connector.on('disconnect', () => {
  console.log('League Client closed');
  RiotAPI = undefined;
  LocalSummoner = undefined;
});
