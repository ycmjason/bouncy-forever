var freeport = require('freeport');

var sysout = require('../util/sysout');
var subprocess = require('../subprocess');
var proxy = require('../proxy');
var Latch = require('../util/Latch');

function setupBouncyServer(config, cb){
  sysout.log();

  var server = proxy(config.getDomainPortMap());
  sysout.log(`Mapping...`);
  config.each((domain, app) => {
    sysout.log(`  \`${app.name}\` launched and listening to port ${app.port}`);
  });

  cb(server);
}

module.exports = function(config, cb){
  // countdown latch to forcefully make sure all sub-servers are launched before the bouncy server does.
  var latch = new Latch(config.getDomains().length, setupBouncyServer.bind(null, config, cb));

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
}
