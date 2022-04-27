import { app, ipcMain } from 'electron';
import fs from 'fs';
import ini from 'ini';
import fse from 'fs-extra';

const botConfigPath = './botConfig.ini';
const botLolConfig = './core/ConfigV2';

ipcMain.on('closeApp', () => {
  app.exit(0);
});

ipcMain.on('writeConfigurationFile', (_, botConfiguration) => {
  if (!fs.existsSync(botConfigPath)) {
    try {
      fs.writeFileSync(botConfigPath, '');
    } catch (error) {
      console.log(`Error to create botConfig.ini: ${error}\n`);
    }
  }

  fse.copySync(botLolConfig, botConfiguration.lolPath, { overwrite: true }, (err) => {
    if (err) {
      console.log(err);
    }
  });

  const iniText = ini.stringify(botConfiguration, { section: 'Config' });
  return fs.writeFileSync(botConfigPath, iniText);
});
