const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const champions = require('./src/champions.json');
const LCUConnector = require('lcu-connector')
const APIClient = require("./src/routes")
const RoutesV2 = require("./src/routesv2")
const Summoner = require("./src/summoner")
const SummonerV2 = require("./src/summonerv2")
const axios = require('axios');
const https = require('https');
const connector = new LCUConnector()
const request = require("request");

app.commandLine.appendSwitch('ignore-certificate-errors');

var LocalSummoner
var RiotAPI

var url = require('url')
var addWindow
var requestUrl
var clientFound = false;

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    frame: false,
    title: "League LevelUp",
    width: 1280,
		height: 720,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  })

  mainWindow.loadFile('./app/index.html') 
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow()
  console.log('loaded');
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

const mainMenuTemplate = [{
	label: 'File',
	submenu: []
}]

app.on('window-all-closed', () => {
	app.quit()
})

const formattedData = (data) => {
  const riotToken = {
    riotToken: `Basic ${Buffer.from(data.username + ':' + data.password).toString('base64')}`,
  };
  const baseUrl = {
    baseUrl: `${data.protocol}://${data.address}:${data.port}`,
  };

  return Object.assign(data, riotToken, baseUrl);
};

const getLocalSummoner = async () => {
  if (!RiotAPI) {
		console.log("League of Legends client not found.");
	} else {
    const instance = axios.create({
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false
      }),
      headers: {
        Authorization: RiotAPI.getAuth(),
      }
    });
    await instance
      .get(RiotAPI.route('lolSummonerV1CurrentSummoner'))
      .then(res => {
        LocalSummoner = new SummonerV2(res.data, RiotAPI);
      })
      .catch(err => {
        console.log(err);
      });  
    }
	}

connector.on('connect', (data) => {
  const riotData = formattedData(data);  
  RiotAPI = new RoutesV2(riotData.baseUrl, riotData.username, riotData.password);
	getLocalSummoner();
  console.log('League Client has started:' + '\n', riotData);
  console.log('Request base URL: ' +  RiotAPI.getAPIBase());
	clientFound = true;
})

ipcMain.on('profileUpdate', (event) => {
  getLocalSummoner()
  event.returnValue = LocalSummoner.getProfileData();
})

ipcMain.on('exit_app', function() {
	app.quit()
})

ipcMain.on('minimize_app', function() {
	mainWindow.minimize()
})

ipcMain.on('requestVersionCheck', (event) => {
	request('https://ddragon.leagueoflegends.com/api/versions.json', (error, response, body) => {
		var data = JSON.parse(body);
		event.sender.send('versions', data[0]);
	})
})

// var searchClient = setInterval(function() {
// 	if (clientFound) {
// 		clearInterval(searchClient);
// 	}
// 	connector.start();
// }, 5000)

connector.start();
