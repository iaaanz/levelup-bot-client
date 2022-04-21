/* eslint-disable prefer-destructuring */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const LCUConnector = require('lcu-connector');
const fs = require('fs');
const fse = require('fs-extra');
const axios = require('axios');
const ini = require('ini');
const RoutesV2 = require('./src/routesv2');
const SummonerV2 = require('./src/summonerv2');

const connector = new LCUConnector();
const credentialsPath = './credentials.ini';
const botConfigPath = './botConfig.ini';
const botLolConfig = './core/ConfigV2';

app.commandLine.appendSwitch('ignore-certificate-errors');

let RiotAPI;
let mainWindow;
let selectedDir;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    frame: false,
    title: 'League LevelUp',
    width: 1024,
    height: 576,
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

app.on('window-all-closed', () => {
  app.quit();
});

const getGameDir = () => selectedDir ?? null;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getLocalSummoner = async () => {
  const { data } = await RiotAPI.instance.get(RiotAPI.route('lolSummonerV1CurrentSummoner'));
  const localSummoner = new SummonerV2(data, RiotAPI);
  return localSummoner;
};

const formattedData = (data) => {
  const baseUrl = `${data.protocol}://${data.address}:${data.port}`;

  return { ...data, baseUrl };
};

const getSession = async () => {
  while (!fs.existsSync(credentialsPath)) {
    await sleep(1000);
    console.log('File with session information not found');
  }
  console.log('Session information file found successfully!');
};

ipcMain.on('exitApp', () => {
  app.quit();
});

ipcMain.on('minimizeApp', () => {
  mainWindow.minimize();
});

ipcMain.on('requestVersionCheck', async (event) => {
  const { data } = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
  event.sender.send('versions', data[0]);
});

ipcMain.handle('profileUpdate', async () => {
  if (!RiotAPI) return 'Offline';
  const localSummoner = await getLocalSummoner();
  if (!localSummoner) return 'Updating';
  const result = await localSummoner.getProfileData();
  return result;
});

ipcMain.on('saveConfiguration', (event, basicBotConfiguration) => {
  if (!getGameDir()) {
    return dialog.showMessageBoxSync(mainWindow, {
      message: 'Select the League of Legends path',
      type: 'warning',
    });
  }

  const botConfig = {
    ...basicBotConfiguration,
    lolPath: getGameDir(),
  };

  if (!fs.existsSync(botConfigPath)) {
    try {
      fs.writeFileSync(botConfigPath, '');
    } catch (error) {
      console.log(`Error to create botConfig.ini: ${error}\n`);
    }
  }

  fse.copySync(botLolConfig, getGameDir(), { overwrite: true }, (err) => {
    if (err) {
      console.log(err);
    }
  });

  const iniText = ini.stringify(botConfig, { section: 'Config' });
  return fs.writeFileSync(botConfigPath, iniText);
});

ipcMain.on('selectDir', (event) => {
  selectedDir = dialog.showOpenDialogSync(mainWindow, {
    title: 'Select the League of Legends folder (E.g.: C:\\Riot Games\\League of Legends)',
    properties: ['openDirectory'],
    defaultPath: 'C:\\Riot Games',
  });

  selectedDir = selectedDir ? selectedDir[0] : null;
  console.log('Directory selected: ', selectedDir);
  event.sender.send('selectedDir', selectedDir);
});

ipcMain.on('startBot', () => {
  if (!getGameDir() || !fs.existsSync(botConfigPath) || !fs.existsSync(credentialsPath)) {
    return dialog.showMessageBoxSync(mainWindow, {
      message: `Required files/paths not found:
      lolPath: ${getGameDir() ? 'Found' : 'Not Found'}
      botConfigPath: ${fs.existsSync(botConfigPath) ? 'Found' : 'Not Found'}
      credentialsPath: ${fs.existsSync(credentialsPath) ? 'Found' : 'Not Found'}`,
      type: 'error',
    });
  }

  // Executar aqui EXE
  return true;
});

connector.start();

connector.on('connect', async (data) => {
  const riotData = formattedData(data);
  RiotAPI = new RoutesV2(riotData.baseUrl, riotData.username, riotData.password);

  console.log('League Client has started:');
  console.log(`API Base Url: ${RiotAPI.getAPIBase()}`);

  fs.writeFile(credentialsPath, '', (err) => {
    if (err) {
      return console.log(`Error to create credentials.ini: ${err}\n`);
    }

    const iniText = ini.stringify(riotData, { section: 'riotData' });
    fs.writeFileSync(credentialsPath, iniText);
    console.log('Connection file created successfully!');
    return getSession();
  });
});

connector.on('disconnect', () => {
  console.log('League Client closed');
  RiotAPI = null;
});
