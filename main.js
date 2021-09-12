const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const champions = require('./src/champions.json');

app.commandLine.appendSwitch('ignore-certificate-errors');

var url = require('url')
var request = require('request')
var LCUConnector = require('lcu-connector')
var connector = new LCUConnector()
var APIClient = require("./src/routes")
var Summoner = require("./src/summoner")
var LocalSummoner
var routes

// Setting default settings
var autoAccept_enabled = false
var invDecline_enabled = false
var ignoredDeclines = []

// Defining global variables
let addWindow
var userAuth
var passwordAuth
var requestUrl

var clientFound = false;

function getLocalSummoner() {

	if (!routes) {
		console.log("League of Legends client not found.");
	} else {
		let url = routes.Route("localSummoner")

		let body = {
			url: url,
			"rejectUnauthorized": false,
			headers: {
				Authorization: routes.getAuth()
			}
		}

		let callback = function(error, response, body) {
			LocalSummoner = new Summoner(body, routes)
		}

		request.get(body, callback)
	}
}

connector.on('connect', (data) => {
	requestUrl = data.protocol + '://' + data.address + ':' + data.port
	routes = new APIClient(requestUrl, data.username, data.password)

	getLocalSummoner()

	userAuth = data.username
	passwordAuth = data.password

	console.log('Request base url set to: ' + routes.getAPIBase())
	clientFound = true;
})

function createWindow () {
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

// Menu template
const mainMenuTemplate = [{
	label: 'File',
	submenu: []
}]

app.on('window-all-closed', () => {
	app.quit()
})

ipcMain.on('reset', function() {
	LocalSummoner.reset()
})

ipcMain.on('exit_app', function() {
	app.quit()
})

ipcMain.on('minimize_app', function() {
	mainWindow.minimize()
})

ipcMain.on('submitTierDivison', (event, tier, division) => {
	if (!routes) return;
	
	let url = routes.Route("submitTierDivison")
	let body = {
		url: url,
		"rejectUnauthorized": false,
		headers: {
			Authorization: routes.getAuth()
		},
		json: {
			"lol": {
				"rankedLeagueTier": tier,
				"rankedLeagueDivision": division
			}
		}
	}

	request.put(body)

})

ipcMain.on('submitLevel', (event, level) => {
	if (!routes) return;

	let url = routes.Route("submitLevel")
	let body = {
		url: url,
		"rejectUnauthorized": false,
		headers: {
			Authorization: routes.getAuth()
		},
		json: {
			"lol": {
				"level": level.toString()
			}
		}
	}

	request.put(body)

})

ipcMain.on('submitStatus', (event, status) => {
	if (!routes) return;

	let url = routes.Route("submitStatus")
	let body = {
		url: url,
		"rejectUnauthorized": false,
		headers: {
			Authorization: routes.getAuth()
		},
		json: {
			"statusMessage": status
		}
	}

	request.put(body)

})

ipcMain.on('submitLeagueName', (event, leagueName) => {
	if (!routes) return;

	let url = routes.Route("submitLeagueName")
	let body = {
		url: url,
		"rejectUnauthorized": false,
		headers: {
			Authorization: routes.getAuth()
		},
		json: {
			"lol": {
				"rankedLeagueName": leagueName
			}
		}
	}

	request.put(body)

})

ipcMain.on('submitAvailability', (event, availability) => {
	if (!routes) return;

	let url = routes.Route("submitAvailability")
	let body = {
		url: url,
		"rejectUnauthorized": false,
		headers: {
			Authorization: routes.getAuth()
		},
		json: {
			"availability": availability
		}
	}

	request.put(body)

})

ipcMain.on('submitIcon', (event, icon) => {
	if (!routes) return;

	let url = routes.Route("submitIcon")
	let body = {
		url: url,
		"rejectUnauthorized": false,
		headers: {
			Authorization: routes.getAuth()
		},
		json: {
			"icon": icon
		}
	}

	request.put(body)

})

ipcMain.on('submitSummoner', (event, name) => {
	if (!routes) return;

	let url = routes.Route("submitSummoner")
	let body = {
		url: url,
		"rejectUnauthorized": false,
		headers: {
			Authorization: routes.getAuth()
		},
		json: {
			"name": name
		}
	}

	request.put(body)
})

ipcMain.on('submitWinsLosses', (event, wins, losses) => {
	if (!routes) return;

	let url = routes.Route("submitWinsLosses")
	let body = {
		url: url,
		"rejectUnauthorized": false,
		headers: {
			Authorization: routes.getAuth()
		},
		json: {
			"lol": {
				"rankedWins": wins.toString(),
				"rankedLosses": losses.toString()
			}
		}
	}

	request.put(body)

})

ipcMain.on('profileUpdate', (event, wins, losses) => {
  console.log('caiu aqui');
  console.log(LocalSummoner.getRankedStats());
	getLocalSummoner()
	if (!LocalSummoner) return;
	event.returnValue = LocalSummoner.getProfileData()
})

ipcMain.on('autoAccept', (event, int) => {
	if (int) {
		autoAccept_enabled = true
	} else {
		autoAccept_enabled = false
	}
})

ipcMain.on('invDecline', (event, int) => {
	if (int) {
		invDecline_enabled = true
	} else {
		invDecline_enabled = false
	}
})

ipcMain.on('submitLobby', (event, queueId, members) => {
	if (!routes) return;

	let url = routes.Route("submitSummoner")
	let body = {
		url: url,
		"rejectUnauthorized": false,
		headers: {
			Authorization: routes.getAuth()
		},
		json: {
			"lol": {
				"pty": "{\"partyId\":\"404debc0-91a0-4b62-9335-aae99e6d8b48\",\"queueId\":" + queueId + ",\"summoners\":" + members + "}",
			}
		}
	}

	request.put(body)
})

ipcMain.on('saveIgnored', (event, names) => {
	ignoredDeclines = names
})

ipcMain.on('requestVersionCheck', (event) => {
	request('https://raw.githubusercontent.com/4dams/LeagueToolkit/master/LeagueToolkit/version.json', (error, response, body) => {
		var data = JSON.parse(body)
		event.sender.send('versions', data["toolkit-version"], data["game-version"])
	})
})

var autoAccept = function() {
	setInterval(function() {
		if (!routes) return;

		let url = routes.Route("autoAccept")
		let body = {
			url: url,
			"rejectUnauthorized": false,
			headers: {
				Authorization: routes.getAuth()
			},
		}

		let callback = function(error, response, body) {
			if (!body || !IsJsonString(body)) return
			var data = JSON.parse(body)

			if (data["state"] === "InProgress") {

				if (data["playerResponse"] === "None") {
					let acceptUrl = routes.Route("accept")
					let acceptBody = {
						url: acceptUrl,
						"rejectUnauthorized": false,
						headers: {
							Authorization: routes.getAuth()
						},
						json: {}
					}

					let acceptCallback = function(error, response, body) {}

					if (autoAccept_enabled) {
						request.post(acceptBody, acceptCallback)
					}

				}
			}
		}

		request.get(body, callback)
	}, 1000)
}

function IsJsonString(str) {
	try {
		JSON.parse(str)
	} catch (e) {
		return false
	}
	return true
}

function autoDecline() {
	setInterval(function() {
		if (!routes) return

		let url = routes.Route("invDecline")
		let body = {
			url: url,
			"rejectUnauthorized": false,
			headers: {
				Authorization: routes.getAuth()
			},
		}

		let callback = function(error, response, body) {
			if (!body || !IsJsonString(body)) return

			var data = JSON.parse(body)

			if (data.length > 0) {
				if (typeof data[0].invitationId !== 'undefined') {

					if (!ignoredDeclines.includes(data[0].fromSummonerName)) {

						let declineUrl = routes.Route("invDecline") + "/" + data[0].invitationId + "/decline"

						let declineBody = {
							url: declineUrl,
							"rejectUnauthorized": false,
							headers: {
								Authorization: routes.getAuth()
							},
							json: {}
						}

						if (invDecline_enabled) {
							request.post(declineBody)
						}

					}
				}
			}
		}

		request.get(body, callback)
	}, 500)

}

autoAccept()
autoDecline()

var searchClient = setInterval(function() {
	if (clientFound) {
		clearInterval(searchClient);
	}
	connector.start();
}, 5000)

connector.start();
