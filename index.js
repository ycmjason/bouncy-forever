var freeport = require('freeport');
var homedir = require('homedir');

var config = require('./lib/core/config');
var subprocess = require('./lib/subprocess');
var proxy = require('./lib/proxy');
var Latch = require('./lib/util/Latch');

var PORT = process.env.PORT || 8080;

var DEFAULT_CONFIG_PATH = homedir() + '/.bouncy-forever.config.json'
var config_path = process.argv[2]? process.cwd() + '/' + process.argv[2]: DEFAULT_CONFIG_PATH;
var config = config(config_path);

var domain_port_map = {};

// countdown latch to forcefully make sure all sub-servers are launched before the bouncy server does.
var latch = new Latch(config.getDomains().length, launchBouncyServer);

// launch each sub-servers
config.each((domain, app_config) => {
  freeport((err, port) => {
    if(err) throw err;

    subprocess(app_config).start(port, function(){
      domain_port_map[domain] = port;
      console.log(`${app_config.name} launched and listening on port ${port}...`);
      latch.down();
    });
  });
});

function launchBouncyServer(){
  console.log();
  // append port to the domains if PORT != 80
  if(PORT != 80){
    var temp = domain_port_map;
    domain_port_map = {};
    Object.keys(temp).forEach(domain => {
      domain_port_map[domain + ':' + PORT] = temp[domain];
    });
  }

  var server = proxy(domain_port_map);
  server.listen(PORT, function(){
    console.log(`Mapping...`);
    Object.keys(domain_port_map).forEach(domain => {
      console.log(`  ${domain} to port ${domain_port_map[domain]}`);
    });
    console.log(`bouncy-forever server launched and listening on port ${PORT}...`);
  });
}
