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

module.exports.releaseInfo = {
    version: '3.0.0',
    codename: '',
};

module.exports.generatedInfo = require('./release-generated');

module.exports.fullVersion = module.exports.releaseInfo.version + ' ' +
    module.exports.generatedInfo.buildType + ' (' +
    module.exports.generatedInfo.gitBranch + '-' +
    module.exports.generatedInfo.gitRevision + '-' +
    module.exports.generatedInfo.dateStamp + ')';