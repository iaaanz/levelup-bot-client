/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const { app, BrowserWindow, ipcMain } = require('electron');
const LCUConnector = require('lcu-connector');
const axios = require('axios');
const https = require('https');
const request = require('request');
const RoutesV2 = require('./src/routesv2');
const SummonerV2 = require('./src/summonerv2');
// const path = require('path');
// const url = require('url');
// const champions = require('./src/champions.json');
// const APIClient = require('./src/routes');
// const Summoner = require('./src/summoner');

const connector = new LCUConnector();

app.commandLine.appendSwitch('ignore-certificate-errors');

let LocalSummoner;
let RiotAPI;
let clientFound;

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
      LocalSummoner = new SummonerV2(res.data, RiotAPI);
      return LocalSummoner;
    })
    .catch((err) => {
      console.log(err);
    });
};

connector.on('connect', (data) => {
  const riotData = formattedData(data);
  RiotAPI = new RoutesV2(riotData.baseUrl, riotData.username, riotData.password);
  getLocalSummoner();
  console.log('League Client has started:');
  console.log(riotData);
  console.log(`Request base URL: ${RiotAPI.getAPIBase()}`);
  clientFound = true;
});

ipcMain.on('profileUpdate', async (event) => {
  if (!RiotAPI) return;
  getLocalSummoner();
  event.returnValue = LocalSummoner.getProfileData();
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

// const searchClient = setInterval(() => {
//   if (clientFound) {
//     clearInterval(searchClient);
//   }
//   connector.start();
// }, 5000);

connector.start();
