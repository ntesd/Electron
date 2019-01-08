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

    populateStreams() {
        var html = '';

        function iterateProvider(providerObject) {
            html += '<li><a href="#">' + providerObject.Name + '</a><ul>'
            providerObject.Streams.forEach(function(x) {
                html += '<li><a href="#" id="' +
                    x.GuidId.replace('{','').replace('}','') +'">' +
                    x.Name + '</a></li>';
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

            providerObject.Streams.some(function(x) {
                if(x.GuidId === '{' + guidId + '}') {
                    returnValue = x;
                    return true;
                }
                return false;
            });

            if(providerObject.SubProviders != undefined) {
                providerObject.SubProviders.some(function(x) {
                    var element = iterateProvider(x);
                    if(element != undefined) {
                        returnValue = element;
                        return true;
                    }
                    return false;
                });
            }

            return returnValue;
        };

        var returnValue = undefined;

        this.Providers.some(function(x) {
            var element = iterateProvider(x);
            if(element != undefined) {
                returnValue = element;
                return true;
            }
            return false;
        });

        return returnValue;
    };

    getStreamEmbed(embedName) {
        var returnValue = undefined;

        this.StreamEmbeds.some(function(x) {
            if(x.ID === embedName) {
                returnValue = x.Embed;
                return true;
            }
            return false;
        });

        return returnValue;
    };

    getChatEmbed(embedName) {
        var returnValue = undefined;

        this.ChatEmbeds.some(function(x) {
            if(x.ID === embedName) {
                returnValue = x.Embed;
                return true;
            }
            return false;
        });

        return returnValue;
    };
};
