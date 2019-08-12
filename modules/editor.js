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
    BrowserWindow,
    Menu
} = require('electron');

const editorMenu = [{
        label: 'File',
        submenu: [{
                label: 'Open',
                click(item, focusedWindow) {
                    focusedWindow.webContents.send('open-file');
                }
            },
            {
                label: 'Save',
                click(item, focusedWindow) {
                    focusedWindow.webContents.send('save-file');
                }
            },
            {
                label: 'Save As....',
                click(item, focusedWindow) {
                    focusedWindow.webContents.send('save-file-as');
                }
            },
            {
                type: 'separator'
            },
            {
                role: 'close'
            }
        ]
    },
    {
        label: 'Debug',
        submenu: [{
            label: 'Show Debug Tools',
            click(item, focusedWindow) {
                focusedWindow.webContents.openDevTools();
            }
        }]
    }
];

module.exports.openEditor = function () {
    var about = new BrowserWindow({
        width: 800,
        height: 600
    });
    about.setMenu(Menu.buildFromTemplate(editorMenu));
    about.loadFile('assets/html/sd_streameditor.html');
};