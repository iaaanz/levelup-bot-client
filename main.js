/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const LCUConnector = require('lcu-connector');
const fs = require('fs');

const connector = new LCUConnector();
const request = require('request');
const ini = require('ini');
const path = require('path');
const RoutesV2 = require('./src/routesv2');
const SummonerV2 = require('./src/summonerv2');
// const { getChampions } = require('./src/champions.');

const credentialsPath = './credentials.ini';

app.commandLine.appendSwitch('ignore-certificate-errors');

let LocalSummoner;
let RiotAPI;
let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    frame: false,
    title: 'League LevelUp',
    width: 1280,
    height: 720,
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

ipcMain.handle('profileUpdate', async () => {
  if (!RiotAPI) return 'Offline';
  getLocalSummoner();
  if (!LocalSummoner) return 'Updating';
  const result = await LocalSummoner.getProfileData();
  return result;
});

const getSession = async () => {
  while (!fs.existsSync(credentialsPath)) {
    await sleep(1000);
    console.log('Arquivo com as informacoes da sessao nao encontrados');
  }
  console.log('Arquivo com as informacoes da sessao encontrados com sucesso!');
};

// ipcMain.on('saveConfiguration', (botConfig) => {
//   console.log(botConfig);
// });

ipcMain.on('select-dirs', async (event, arg) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
  console.log('directories selected', result.filePaths);
});

connector.start();

connector.on('connect', (data) => {
  const riotData = formattedData(data);
  RiotAPI = new RoutesV2(riotData.baseUrl, riotData.username, riotData.password);
  getLocalSummoner();
  console.log('League Client has started:');
  console.log(`Request base URL: ${RiotAPI.getAPIBase()}`);

  fs.writeFile('credentials.ini', '', (err) => {
    if (err) {
      return console.log(`Erro ao criar credentials.ini: ${err}\n`);
    }

    const iniText = ini.stringify(riotData, { section: 'riotData' });
    fs.writeFileSync('./credentials.ini', iniText);
    console.log('Arquivo de conexao criado com sucesso!');
    return getSession();
  });
});

connector.on('disconnect', () => {
  console.log('League Client closed');
  RiotAPI = undefined;
  LocalSummoner = undefined;
});
