/* eslint-disable prefer-destructuring */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const LCUConnector = require('lcu-connector');
const fs = require('fs');
// const exec = require('child_process').execFile;

const connector = new LCUConnector();
const request = require('request');
const ini = require('ini');
const path = require('path');
const RoutesV2 = require('./src/routesv2');
const SummonerV2 = require('./src/summonerv2');

const credentialsPath = './credentials.ini';
const botConfigPath = './botConfig.ini';

app.commandLine.appendSwitch('ignore-certificate-errors');

let LocalSummoner;
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
      preload: path.join(__dirname, 'preload.js'),
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

const getLocalSummoner = async () => {
  await RiotAPI.instance
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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const formattedData = (data) => {
  const riotToken = {
    riotToken: `Basic ${Buffer.from(`${data.username}:${data.password}`).toString('base64')}`,
  };
  const baseUrl = {
    baseUrl: `${data.protocol}://${data.address}:${data.port}`,
  };

  return Object.assign(data, riotToken, baseUrl);
};

const getSession = async () => {
  while (!fs.existsSync(credentialsPath)) {
    await sleep(1000);
    console.log('Arquivo com as informacoes da sessao nao encontrados');
  }
  console.log('Arquivo com as informacoes da sessao encontrados com sucesso!');
};

const getGameDir = () => {
  const gameDir = {
    lolPath: selectedDir || '',
  };

  return gameDir;
};

ipcMain.on('exitApp', () => {
  app.quit();
});

ipcMain.on('minimizeApp', () => {
  mainWindow.minimize();
});

ipcMain.on('requestVersionCheck', (event) => {
  request('https://ddragon.leagueoflegends.com/api/versions.json', (error, response, body) => {
    const data = JSON.parse(body);
    event.sender.send('versions', data[0]);
  });
});

ipcMain.handle('profileUpdate', async () => {
  if (!RiotAPI) return 'Offline';
  getLocalSummoner();
  if (!LocalSummoner) return 'Updating';
  const result = await LocalSummoner.getProfileData();
  return result;
});

ipcMain.on('saveConfiguration', (event, botConfig) => {
  if (!getGameDir().lolPath) {
    return dialog.showMessageBoxSync(mainWindow, {
      message: 'Selecione o caminho do League of Legends',
      type: 'warning',
    });
  }

  Object.assign(botConfig, getGameDir());

  if (!fs.existsSync(botConfigPath)) {
    try {
      fs.writeFileSync(botConfigPath, '');
    } catch (error) {
      console.log(`Erro ao criar botConfig.ini: ${error}\n`);
    }
  }

  const iniText = ini.stringify(botConfig, { section: 'Config' });
  return fs.writeFileSync(botConfigPath, iniText);
});

ipcMain.on('selectDir', (event) => {
  selectedDir = dialog.showOpenDialogSync(mainWindow, {
    title: 'Selecione a pasta do League of Legends (Ex: C:\\Riot Games\\League of Legends)',
    properties: ['openDirectory'],
    defaultPath: 'C:\\Riot Games',
  });
  console.log('Directory selected: ', selectedDir[0]);
  selectedDir = selectedDir[0];
  event.sender.send('selectedDir', selectedDir);
});

ipcMain.on('startBot', () => {
  if (!selectedDir || !fs.existsSync(botConfigPath) || !fs.existsSync(credentialsPath)) {
    console.log(`
    selectedDir: ${selectedDir}
    botConfigPath: ${!fs.existsSync(botConfigPath)}
    credentialsPath: ${!fs.existsSync(credentialsPath)}
    `);
    return dialog.showMessageBoxSync(mainWindow, {
      message: 'Required files not found.',
      type: 'error',
    });
  }

  // Executar aqui EXE
  return true;
});

connector.start();

connector.on('connect', (data) => {
  const riotData = formattedData(data);
  RiotAPI = new RoutesV2(riotData.baseUrl, riotData.username, riotData.password);
  getLocalSummoner();
  console.log('League Client has started:');
  console.log(`Request base URL: ${RiotAPI.getAPIBase()}`);

  fs.writeFile(credentialsPath, '', (err) => {
    if (err) {
      return console.log(`Erro ao criar credentials.ini: ${err}\n`);
    }

    const iniText = ini.stringify(riotData, { section: 'riotData' });
    fs.writeFileSync(credentialsPath, iniText);
    console.log('Arquivo de conexao criado com sucesso!');
    return getSession();
  });
});

connector.on('disconnect', () => {
  console.log('League Client closed');
  RiotAPI = undefined;
  LocalSummoner = undefined;
});
