const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

var win;

function createMainWindow() {
    win = new BrowserWindow({width: 800, height: 600});
    win.setMenu(null);

    win.loadFile('assets/html/sd_mainscreen.html');
}

function openDevTools() {
    win.webContents.openDevTools();
}

ipcMain.on('open-devtools', openDevTools)
app.on('ready', createMainWindow);