const electron = require('electron');
const sd = require('../../sd_database');
const ipcRenderer = electron.ipcRenderer;
const $ = require('jquery');
const Konami = require('konami');
const settings = require('../../settings');

var db;

settings.initSettings();

window.onunload = function() {
    settings.saveSettings();
};

if(settings.returnSettings().showDebugMode) {
    $('#debug').show();
}

const showDevFunctions = new Konami(function() {
    $('#debug').show();
});

$('#menu_showdevtools').bind('click', function() {
    ipcRenderer.send('open-devtools');
});

$('#menu_about').bind('click', function() {
    ipcRenderer.send('open-aboutwindow');
});

$('#menu_prefs').bind('click', function() {

});

$('#menu_showChat').bind('click', function() {

});

$('#menu_forceUpdate').bind('click', function() {

});

settings.returnSettings().streamFiles.forEach(function(x) {
    loadDatabase(x);
});

function loadDatabase(dbPath) {
    db = sd.StreamDeskDatabase.open(dbPath);

    $('#streamlist').html(db.populateStreams());
    $("#streamlist").find("a").each(function(){ if(this.id) {
        $('#' + this.id).on('click', function() {
            var stream = db.getStreamInformationForGuid(this.id);
            $('#streamView').html(db.getStreamEmbed(stream.StreamEmbed).replace('$ID$', stream.ID));
        }); 
    }});
}
