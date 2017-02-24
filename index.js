var freeport = require('freeport');
var homedir = require('homedir');

var config = require('./lib/core/config');
var subprocess = require('./lib/subprocess');
var proxy = require('./lib/proxy');
var Latch = require('./lib/util/Latch');

var PORT = process.env.PORT || 8080;

var DEFAULT_CONFIG_PATH = homedir() + '/.bouncy-forever.config.json'
var config_path = process.argv[2]? process.cwd() + '/' + process.argv[2]: DEFAULT_CONFIG_PATH;
var config = config(config_path, PORT);

// countdown latch to forcefully make sure all sub-servers are launched before the bouncy server does.
var latch = new Latch(config.getDomains().length, launchBouncyServer);

// launch each sub-servers
config.each((domain, app) => {
  freeport((err, port) => {
    if(err) throw err;

    subprocess(app).start(port, function(){
      console.log(`${app.name} launched and listening on port ${port}...`);
      app.port = port;
      latch.down();
    });
  });
});

function launchBouncyServer(){
  console.log();

  var server = proxy(config.getDomainPortMap());
  server.listen(PORT, function(){
    console.log(`Mapping...`);
    config.each((domain, app) => {
      console.log(`  \`${app.name}\` launched and listening to port ${app.port}`);
    });
    console.log(`bouncy-forever server launched and listening on port ${PORT}...`);
  });
}
