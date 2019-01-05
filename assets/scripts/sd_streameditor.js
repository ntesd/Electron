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

const remote = require('electron').remote;
var win = remote.getCurrentWindow();
win.webContents.openDevTools();

const $ = require('jquery');
const JSONEditor = require('@json-editor/json-editor');

$.getJSON('../schemas/db_schema.json', function(data) {
    var element = document.getElementById('parent');

    var editor = new JSONEditor(element, {
        schema: data
    });
});