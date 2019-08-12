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
    StreamDeskDatabase,
    StreamDeskEmbed,
    StreamDeskStream,
    StreamDeskProvider
} = require('.');
const Parser = require('rss-parser');

const fs = require('fs');

var databases = [];

module.exports = {
    loadDatabase: function (filePath, afterLoadCallback) {
        function iterateProvider(providerJson, providerObject) {
            providerJson.Streams.forEach(function (x) {
                var stream = new StreamDeskStream(x.ID, x.GuidId, x.Name, x.Description, x.Web,
                    x.Promoted, x.StreamEmbed, x.ChatEmbed, x.Channel, x.Width, x.Height);
                x.Tags.forEach(function (i) {
                    stream.Tags.push(i);
                });
                providerObject.Streams.push(stream);
            });

            if (providerJson.SubProviders != undefined) {
                providerJson.SubProviders.forEach(function (x) {
                    var provider = new StreamDeskProvider(x.Name);
                    iterateProvider(x, provider);
                    providerObject.SubProviders.push(provider);
                });
            }

            providerObject.ProviderUri = providerJson.ProviderUri;
            providerObject.ProviderType = providerJson.ProviderType;
        }

        function iterateRSS(providerObject, refreshCallback) {
            function uuidv4() {
                return '{xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx}'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0,
                        v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            }

            if (providerObject.ProviderType === 'GenericRSSFeed') {
                (async () => {
                    var parser = new Parser({
                        customFields: {
                            item: [
                                ['media:content', 'mediacontent'],
                            ]
                        }
                    });
                    var feed = await parser.parseURL(providerObject.ProviderUri)

                    feed.items.forEach(function (item) {
                        var stream = new StreamDeskStream(item.mediacontent.$.url, uuidv4(), item.title, item.description, item.link,
                            false, 'embed_videostream', 'none', '', 640, 480);
                        //x.Tags.forEach(function (i) {
                        //    stream.Tags.push(i);
                        //});
                        providerObject.Streams.push(stream);
                    });

                    refreshCallback();
                })();
            }

            if (providerObject.SubProviders != undefined) {
                providerObject.SubProviders.forEach(function (x) {
                    iterateRSS(x, refreshCallback);
                });
            }
        }

        if (typeof (filePath) == undefined) {
            throw "filePath is undefined!";
        }

        var db = JSON.parse(fs.readFileSync(filePath));

        if (db.fileType == undefined || db.fileType != 'StreamDesk Electron JSONDB') {
            throw new Error("The JSON used in this file is not a StreamDesk Electron JSONDB File.");
        }

        var sdDbClass = new StreamDeskDatabase();
        sdDbClass.Name = db.Name;
        sdDbClass.Description = db.Description;
        sdDbClass.VendorName = db.VendorName;

        db.StreamEmbeds.forEach(function (x) {
            sdDbClass.StreamEmbeds.push(new StreamDeskEmbed(x.ID, x.Name, x.Embed));
        });

        db.ChatEmbeds.forEach(function (x) {
            sdDbClass.ChatEmbeds.push(new StreamDeskEmbed(x.ID, x.Name, x.Embed));
        });

        db.Providers.forEach(function (x) {
            var provider = new StreamDeskProvider(x.Name, x.ProviderType, x.ProviderUri);
            iterateProvider(x, provider);
            sdDbClass.Providers.push(provider);
        });

        databases.push(sdDbClass);

        sdDbClass.Providers.forEach(function (x) {
            iterateRSS(x, () => {
                afterLoadCallback(sdDbClass);
            });
        });
        afterLoadCallback(sdDbClass);
    },

    populateStreams: function () {
        var menu = [];
        databases.forEach(function (x) {
            var menuItem = {}
            menuItem.label = x.Name;
            menuItem.submenu = x.populateStreams();
            menu.push(menuItem);
        });
        return menu;
    },

    getDatabaseAndStreamFromGuid: function (guidId) {
        var returnValue = undefined;

        databases.some(function (x) {
            var stream = x.getStreamInformationForGuid(guidId);
            if (stream != undefined) {
                returnValue = {
                    stream: stream,
                    db: x
                };
                return true;
            }
            return false;
        });

        return returnValue;
    },

    getAllStreams: function () {
        var returnValue = [];

        databases.forEach(function (x) {
            returnValue = returnValue.concat(x.getAllStreams());
        });

        return returnValue;
    },

    resetDatabase: function () {
        databases = [];
    }
};