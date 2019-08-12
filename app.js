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

const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = require('electron');

const {
    StreamDesk
} = require('./modules/sd_database');

const settings = require('./modules/settings');
var win;

function refreshStreams() {
    var menu = Menu.buildFromTemplate([{
            label: "File",
            submenu: [{
                    label: "Options",
                    click: function () {
                        const prefs = require('./modules/prefs');
                        prefs.openPrefs();
                    }
                },
                {
                    label: "Exit"
                }
            ]
        },
        ...(settings.getSettings().showDebugMode ? [{
            label: "Developer",
            submenu: [{
                    label: 'Open Streams Database Editor',
                    click: function () {
                        const editor = require('./modules/editor');
                        editor.openEditor();
                    }
                },
                {
                    label: "Open Developer Tools",
                    click(item, focusedWindow) {
                        focusedWindow.webContents.openDevTools();
                    }
                }
            ]
        }] : []),
        {
            label: "Streams",
            submenu: StreamDesk.populateStreams()
        },
        {
            label: 'Help',
            submenu: [{
                label: 'About StreamDesk 3...',
                click: function () {
                    var about = new BrowserWindow({
                        width: 600,
                        height: 360,
                        resizable: false,
                        parent: win,
                        modal: true
                    });
                    about.setMenu(null);

                    about.loadFile('assets/html/sd_aboutstreamdesk.html');
                }
            }]
        }
    ])
    Menu.setApplicationMenu(menu);
}

ipcMain.on('get-settings', function (event) {
    event.sender.send('process-settings', settings.getSettings());
});

ipcMain.on('set-settings', function (event, value) {
    settings.setSettings(value);
    win.webContents.send('process-settings', settings.getSettings());
});

ipcMain.on('load-stream', function (value) {
    var streamInfo = StreamDesk.getDatabaseAndStreamFromGuid(value);
    win.webContents.send('set-embed', streamInfo.stream.GuidId, streamInfo.db.getStreamEmbed(streamInfo.stream.StreamEmbed).replace('$ID$', streamInfo.stream.ID));
});

app.on('ready', function () {
    settings.initSettings();

    var settingsobj = settings.getSettings();

    StreamDesk.resetDatabase();
    refreshStreams();
    win = new BrowserWindow({
        width: 800,
        height: 600
    });
    win.loadFile('./assets/html/sd_mainscreen.html');

    settingsobj.streamFiles.forEach(function (x) {
        StreamDesk.loadDatabase(x, () => refreshStreams());
    });
});

app.on('window-all-closed', function () {
    app.quit()
});

app.on('will-quit', function () {
    settings.saveSettings();
});