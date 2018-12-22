/*************************************************************************************
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
 **************************************************************************************/

const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

const sd = require('./sd_database');
    
const StreamDeskDatabase = sd.StreamDeskDatabase;
const StreamDeskProvider = sd.StreamDeskProvider;
const StreamDeskStream = sd.StreamDeskStream;
const StreamDeskEmbed = sd.StreamDeskEmbed;
const settings = require('./settings');

var win;

ipcMain.on('open-devtools', function() {
    win.webContents.openDevTools();
});
ipcMain.on('open-aboutwindow', function() {
    var about = new BrowserWindow({width: 600, height: 400, resizable: false, parent: win, modal: true});
    about.setMenu(null);

    about.loadFile('assets/html/sd_aboutstreamdesk.html');
});
ipcMain.on('get-version', function(event) { event.returnValue = require('./package.json').version; });
ipcMain.on('create-devdatabase', function(event, filePath) {
    var db = new StreamDeskDatabase('Developer Test Database', 'Used for creating a JSON Schema and dev testing', 'NasuTek Enterprises');
    var streamEmbed = new StreamDeskEmbed('stream_twitch', 'Twitch', '<iframe class="stream-frame" src="https://player.twitch.tv/?channel=$ID$"></iframe>');
    var provider = new StreamDeskProvider('Test Provider');
    var subprovider = new StreamDeskProvider('Test SubProvider');
    var stream = new StreamDeskStream('fafafanta', '{9D5885B2-5D09-4AF4-BF91-895FB0368FB0}', 'FantaVision', 'Game Watching', 'https://www.patreon.com/FANTAVISION', false, 'stream_twitch', 'none', 'none', 800, 600, 'Twitch.TV', 'LetsPlay');
    var testStream = new StreamDeskStream('test', '{ACE41FD3-DD15-4E33-8769-FB891E3FC509}', 'Test Stream', 'Tests Streams', 'http://streamdesk.ca', false, 'stream_test', 'chat_test', 'test', 800, 600, 'Test', 'Tags');
    subprovider.Streams.push(testStream);
    provider.Streams.push(stream);
    provider.SubProviders.push(subprovider);
    db.Providers.push(provider);
    db.StreamEmbeds.push(streamEmbed);

    db.save(filePath);   
});

app.on('ready', function() {
    win = new BrowserWindow({width: 800, height: 600});
    win.setMenu(null);

    win.loadFile('assets/html/sd_mainscreen.html');
});