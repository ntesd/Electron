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

const fs = require('fs');

const StreamDeskEmbed = require('./embed');
const StreamDeskProvider = require('./provider');
const StreamDeskStream = require('./stream');

module.exports = class StreamDeskDatabase {
    constructor(name = '', description = '', vendorName = '') {
        this.fileType = "StreamDesk Electron JSONDB"
        this.minimumCompatible = "3.0.0";
        this.databaseVersion = "1";

        this.Name = name;
        this.Description = description;
        this.VendorName = vendorName;
        
        this.StreamEmbeds = [];
        this.ChatEmbeds = [];
        this.Providers = [];
    };

    static open(filePath) {
        function iterateProvider(providerJson, providerObject) {
            providerJson.Streams.forEach(function(x) {
                var stream = new StreamDeskStream(x.ID, x.GuidId, x.Name, x.Description, x.Web, x.Promoted, x.StreamEmbed, x.ChatEmbed, x.Channel, x.Width, x.Height);
                x.Tags.forEach(function(i) {
                    stream.Tags.push(i);
                });
                providerObject.Streams.push(stream);
            });

            if(providerJson.SubProviders != undefined) {
                providerJson.SubProviders.forEach(function(x) {
                    var provider = new StreamDeskProvider(x.Name);
                    iterateProvider(x, provider);
                    providerObject.SubProviders.push(provider);
                });
            }
        };

        if(typeof(filePath) == undefined) {
            throw "filePath is undefined!";
        }

        var json = fs.readFileSync(filePath, 'utf-8');
        var db = JSON.parse(json);

        if(db.fileType == undefined || db.fileType != 'StreamDesk Electron JSONDB') {
            throw new Error("The JSON used in this file is not a StreamDesk Electron JSONDB File.");
        }

        var sdDbClass = new StreamDeskDatabase();
        sdDbClass.Name = db.Name;
        sdDbClass.Description = db.Description;
        sdDbClass.VendorName = db.VendorName;

        db.StreamEmbeds.forEach(function(x) {
            sdDbClass.StreamEmbeds.push(new StreamDeskEmbed(x.ID, x.Name, x.Embed));
        });

        db.ChatEmbeds.forEach(function(x) {
            sdDbClass.ChatEmbeds.push(new StreamDeskEmbed(x.ID, x.Name, x.Embed));
        });

        db.Providers.forEach(function(x) {
            var provider = new StreamDeskProvider(x.Name);
            iterateProvider(x, provider);
            sdDbClass.Providers.push(provider);
        });

        return sdDbClass;
    }

    save(filePath = '') {
        var json = JSON.stringify(this, null, 4);
        fs.writeFile(filePath, json, 'utf-8', function(err) {
            if (err) throw err;
            console.log('File has been saved!');
        });
    };

    populateStreams() {
        var html = '';

        function iterateProvider(providerObject) {
            html += '<li><a href="#">' + providerObject.Name + '</a><ul>'
            providerObject.Streams.forEach(function(x) {
                html += '<li><a href="#" id="'+ x.GuidId.replace('{','').replace('}','') +'">' + x.Name + '</a></li>';
            });

            if(providerObject.SubProviders != undefined) {
                providerObject.SubProviders.forEach(function(x) {
                    iterateProvider(x);
                });
            }

            html += '</ul></li>';
        };

        this.Providers.forEach(function(provider) {
            iterateProvider(provider);
        });

        return html;
    };

    getStreamInformationForGuid(guidId) {
        function iterateProvider(providerObject) {
            var returnValue = undefined;

            providerObject.Streams.forEach(function(x) {
                if(x.GuidId === '{' + guidId + '}') {
                    returnValue = x;
                }
            });

            if(providerObject.SubProviders != undefined) {
                providerObject.SubProviders.forEach(function(x) {
                    var element = iterateProvider(x);
                    if(element != undefined) {
                        returnValue = element;
                    }
                });
            }

            return returnValue;
        };

        var returnValue = undefined;

        this.Providers.forEach(function(x) {
            var element = iterateProvider(x);
            if(element != undefined) {
                returnValue = element;
            }
        });

        return returnValue;
    };

    getStreamEmbed(embedName) {
        var returnValue = undefined;

        this.StreamEmbeds.forEach(function(x) {
            if(x.ID === embedName) {
                returnValue = x.Embed;
            }
        });

        return returnValue;
    };
};