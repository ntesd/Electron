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

module.exports = class StreamDeskStream {
    constructor(id = '', guidId = '{00000000-0000-0000-0000-000000000000}', name = '',
        description = '', web = '', promoted = false, streamembed = '', chatembed = '',
        channel = '', width = 800, height = 600, ...tags) {
        this.ID = id;
        this.GuidId = guidId;
        this.Name = name;
        this.Description = description;
        this.Web = web;
        this.Tags = tags;
        this.Promoted = promoted;
        this.StreamEmbed = streamembed;
        this.ChatEmbed = chatembed;
        this.Channel = channel;
        this.Width = width;
        this.Height = height;
    };
};