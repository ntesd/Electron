const electron = require('electron');

const ipcRenderer = electron.ipcRenderer;
const $ = require('jquery');
const Konami = require('konami');

const showDevFunctions = new Konami(function() {
    $('#debug').show();
});

$('#menu_showdevtools').bind('click', function() {
    ipcRenderer.send('open-devtools');
});