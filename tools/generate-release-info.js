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
const moment = require('moment');
var argv = require('minimist')(process.argv.slice(2));

var branch = fs.readFileSync('./.git/HEAD').toString().substring(5).replace(/\n/g, '');
var commitId = fs.readFileSync('./.git/' + branch).toString().replace(/\n/g, '');
var autogenTemplate = fs.readFileSync('./release-generated.autogen').toString();

var finalTemplate = autogenTemplate.replace('@GIT_BRANCH@', branch.split('/')[2]);
finalTemplate = finalTemplate.replace('@GIT_REVISION@', commitId.substring(0, 12));
finalTemplate = finalTemplate.replace('@BUILD_TYPE@', (typeof argv.t === 'undefined') ? 'Release' : argv.t);
finalTemplate = finalTemplate.replace('@IS_DEBUG_BUILD@', (argv.d ? 'true' : 'false'));
finalTemplate = finalTemplate.replace('@DATE_STAMP@', moment().format('YYYYMMDD_HHmm'));

fs.writeFileSync('./release-generated.js', finalTemplate);