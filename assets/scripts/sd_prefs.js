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
const ipcRenderer = electron.ipcRenderer;

const $ = require('jquery');
const JSONEditor = require('@json-editor/json-editor');
var editor;

ipcRenderer.send('get-settings');

ipcRenderer.on('process-settings', function (event, settings) {
    $.getJSON('../schemas/prefs.json', function (data) {
        var element = document.getElementById('parent');

        editor = new JSONEditor(element, {
            schema: data,
            disable_edit_json: true,
            disable_properties: true
        });
        editor.setValue(settings);
    });
});

function savePrefs() {
    ipcRenderer.send('set-settings', editor.getValue());
    self.close();
}