/***************************************************************************************************
 * StreamDesk 3.0
 * Copyright 2013-2019 NasuTek Global Enterprises
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ***************************************************************************************************/

const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

var win;

ipcMain.on('open-aboutwindow', function() {
    var about = new BrowserWindow({ width: 600, height: 400, resizable: false,
        parent: win, modal: true });
    about.setMenu(null);

    about.loadFile('assets/html/sd_aboutstreamdesk.html');
});

ipcMain.on('open-editor', function() {
    const editor = require('./modules/editor');
    editor.openEditor();
});

ipcMain.on('get-version', function(event) {
    event.returnValue = require('./package.json').version;
});

app.on('ready', function() {
    win = new BrowserWindow({width: 800, height: 600});
    win.setMenu(null);

    win.loadFile('assets/html/sd_mainscreen.html');
});
