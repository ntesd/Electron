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

const fs = require('fs');
const path = require('path');
const release = require('../release');

var settingsPath;
var settings;

module.exports.initSettings = function () {
    settingsPath = process.env.APPDATA || (process.platform == 'darwin' ?
        process.env.HOME + '/Library/Preferences' : '/var/local');
    settingsPath += path.sep + 'streamdesk.json';

    if (fs.existsSync(settingsPath)) {
        settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    } else {
        settings = {
            streamFiles: [(release.generatedInfo.debugBuild ?
                    'devdb.json' :
                    'https://streamdesk.ca/streams.json') // StreamDesk Primary DB Path
            ],
            showDebugMode: release.generatedInfo.debugBuild,
        };
    }
};

module.exports.setSettings = function (value) {
    settings = value;
};

module.exports.getSettings = function () {
    return settings;
};

module.exports.saveSettings = function () {
    var settingsJson = JSON.stringify(settings, null, 4);
    fs.writeFileSync(settingsPath, settingsJson, 'utf-8');
};