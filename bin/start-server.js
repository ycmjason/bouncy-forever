var homedir = require('homedir');
var mkpath = require('mkpath').sync;

var logger = require('../lib/util/logger');
var config = require('../lib/core/config');

var PORT = process.env.PORT || 8080;

var BOUNCY_FOREVER_DIR = `${homedir()}/.bouncy-forever`;
mkpath(BOUNCY_FOREVER_DIR);

try{
  var DEFAULT_CONFIG_PATH = `${BOUNCY_FOREVER_DIR}/config.json`
  var config_path = process.argv[2]? process.cwd() + '/' + process.argv[2]: DEFAULT_CONFIG_PATH;
  var config = config(config_path, PORT);
} catch(e){
  logger.error(`Cannot find config file at ${config_path}`);
  throw e;
  process.exit(1);
}

require('../lib/core/setup-bouncy-forever-server')(config, logger, function(server){
  server.listen(PORT, function(){
    logger.log(`bouncy-forever server launched and listening on port ${PORT}...`);
  });
});

process.on('SIGINT', () => {
  logger.log(`\n================ exited ====================`);
  process.exit(0);
});
