#!/usr/bin/env node
var homedir = require('homedir');
var mkpath = require('mkpath').sync;

var sysout = require('../lib/util/sysout');
var config = require('../lib/core/config');

var PORT = process.env.PORT || 8080;

var BOUNCY_FOREVER_DIR = `${homedir()}/.bouncy-forever`;
mkpath(BOUNCY_FOREVER_DIR);

try{
  var DEFAULT_CONFIG_PATH = `${BOUNCY_FOREVER_DIR}/config.json`
  var config_path = process.argv[2]? process.cwd() + '/' + process.argv[2]: DEFAULT_CONFIG_PATH;
  var config = config(config_path, PORT);
} catch(e){
  sysout.error(`Cannot find config file at ${config_path}`);
  process.exit(1);
}

require('../lib/core/setup-bouncy-forever-server')(config, function(server){
  server.listen(PORT, function(){
    sysout.log(`bouncy-forever server launched and listening on port ${PORT}...`);
  });
});
