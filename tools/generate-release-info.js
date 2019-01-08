const fs = require('fs');
const moment = require('moment');
var argv = require('minimist')(process.argv.slice(2));

var branch = fs.readFileSync('./.git/HEAD').toString().substring(5).replace(/\n/g, '');
var commitId = fs.readFileSync('./.git/' + branch).toString().replace(/\n/g, '');
var autogenTemplate = fs.readFileSync('./release-generated.autogen').toString();

var finalTemplate = autogenTemplate.replace('@GIT_BRANCH@', branch.split('/')[2]);
finalTemplate = finalTemplate.replace('@GIT_REVISION@', commitId.substring(0,12));
finalTemplate = finalTemplate.replace('@BUILD_TYPE@', (typeof argv.t === 'undefined') ? 'Release' : argv.t );
finalTemplate = finalTemplate.replace('@IS_DEBUG_BUILD@', (argv.d ? 'true' : 'false'));
finalTemplate = finalTemplate.replace('@DATE_STAMP@', moment().format('YYYYMMDD_HHmm'));

fs.writeFileSync('./release-generated.js', finalTemplate);
