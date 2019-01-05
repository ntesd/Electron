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
const sd = require('../../modules/sd_database');
const ipcRenderer = electron.ipcRenderer;
const remote = electron.remote;
const $ = require('jquery');
const Konami = require('konami');
const settings = require('../../modules/settings');

var db;
var streamId = "";

settings.initSettings();

window.onunload = function() {
    settings.saveSettings();
};

if(settings.returnSettings().showDebugMode) {
    $('#debug').show();
}

const showDevFunctions = new Konami(function() {
    $('#debug').toggle();
});

$('#menu_showdevtools').bind('click', function() {
    var win = remote.getCurrentWindow();
    win.webContents.openDevTools();
});

$('#menu_about').bind('click', function() {
    ipcRenderer.send('open-aboutwindow');
});

$('#menu_prefs').bind('click', function() {

});
$('#menu_openEditor').bind('click', function() {
    ipcRenderer.send('open-editor');
});

$('#menu_showChat').bind('click', function() {
    $('#chatView').toggle();
    var win = remote.getCurrentWindow();
    var height = $('#chatView').is(':visible') ?
        win.getBounds().height + $('#chatView').height() :
        win.getBounds().height - $('#chatView').height();
    win.setSize(win.getBounds().width, height);

    var stream = db.getStreamInformationForGuid($("meta[name='activeStream']").attr("content"));
    $('#chatView').html(db.getChatEmbed(stream.ChatEmbed).replace('$ID$', stream.ID));

    changeStreamViewDiv();
});

$('#menu_forceUpdate').bind('click', function() {

});

settings.returnSettings().streamFiles.forEach(function(x) {
    loadDatabase(x);
});

function changeStreamViewDiv() {
    var height = $('header').height() +
        (($('#chatView').is(':visible')) ? $('#chatView').height() : 0);

    $('#streamView :first-child').css({
        'display': 'block',
        'max-width': '100%',
        'margin': '0',
        'padding': '0',
        'border': '0 none',
        'box-sizing': 'border-box',
        'height':'calc(100vh - ' + height + 'px)',
        'width':'100vw'
    });
}

function loadDatabase(dbPath) {
    db = sd.StreamDeskDatabase.open(dbPath);

    $('#streamlist').html(db.populateStreams());
    $("#streamlist").find("a").each(function(){ if(this.id) {
        $('#' + this.id).on('click', function() {
            var stream = db.getStreamInformationForGuid(this.id);
            $("meta[name='activeStream']").attr("content", this.id);
            $('#streamView').html(db.getStreamEmbed(stream.StreamEmbed).replace('$ID$', stream.ID));
            changeStreamViewDiv();
        });
    }});
}
