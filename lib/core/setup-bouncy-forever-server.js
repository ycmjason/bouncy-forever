var freeport = require('freeport');

var subprocess = require('../subprocess');
var proxy = require('../proxy');
var Latch = require('../util/Latch');

function setupBouncyServer(config, logger, cb){
  logger.log();

  var server = proxy(config.getDomainPortMap());
  logger.log(`Mapping...`);
  config.each((domain, app) => {
    logger.log(`  ${domain}(${app.name}) to port ${app.port}`);
  });

  cb(server);
}

function setupForeverServers(config, logger, cb){
  // countdown latch to forcefully make sure all sub-servers are launched before the bouncy server does.
  var latch = new Latch(config.getDomains().length, cb);

  // launch each sub-servers
  config.each((domain, app) => {
    freeport((err, port) => {
      if(err) throw err;

      subprocess(app).start(port, function(){
        logger.log(`\`${app.name}\` launched and listening on port ${port}...`);
        app.port = port;
        latch.down();
      });
    });
  });
}

module.exports = function(config, logger, cb){
  setupForeverServers(config, logger, () => setupBouncyServer(config, logger, cb));;
}
