#!/usr/bin/env node
var freeport = require('freeport');
var homedir = require('homedir');
var mkpath = require('mkpath').sync;

var sysout = require('../lib/util/sysout');
var config = require('../lib/core/config');
var subprocess = require('../lib/subprocess');
var proxy = require('../lib/proxy');
var Latch = require('../lib/util/Latch');

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

function launchBouncyServer(){
  sysout.log();

  var server = proxy(config.getDomainPortMap());
  server.listen(PORT, function(){
    sysout.log(`Mapping...`);
    config.each((domain, app) => {
      sysout.log(`  \`${app.name}\` launched and listening to port ${app.port}`);
    });
    sysout.log(`bouncy-forever server launched and listening on port ${PORT}...`);
  });
}

// countdown latch to forcefully make sure all sub-servers are launched before the bouncy server does.
var latch = new Latch(config.getDomains().length, launchBouncyServer);

// launch each sub-servers
config.each((domain, app) => {
  freeport((err, port) => {
    if(err) throw err;

    subprocess(app).start(port, function(){
      sysout.log(`${app.name} launched and listening on port ${port}...`);
      app.port = port;
      latch.down();
    });
  });
});
