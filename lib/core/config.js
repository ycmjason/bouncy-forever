/* Config file structure:
 * {
 *   "app1.ycmjason.com": {
 *     "name": "app_1",
 *     "base_path": "~/Development/app_1/",
 *     "start_script": "npm start"
 *     "env": {
 *       "PROD": "true", ...
 *     }
 *   }, ...
 * } 
 */
var fs = require('fs');

var homedir = require('homedir');

function Config(config){
  this.apps = config;
}

Config.prototype.getDomainPortMap = function(){
  var map = {};
  this.each((domain, app) => {
    map[domain] = app.port;
  });
  return map;
}

Config.prototype.getDomains = function(){
  return Object.keys(this.apps); 
};

Config.prototype.get = function(domain){
  return this.apps[domain];
}

Config.prototype.each = function(fn){
  this.getDomains().forEach(domain => {
    fn(domain, this.get(domain));
  });
  return this;
}



module.exports = function(config_path, PORT){
  var path = config_path || DEFAULT_CONFIG_PATH;
  var config = JSON.parse(fs.readFileSync(path, 'utf8'));

  // repalce ~ with full path of homedir
  var domains = Object.keys(config);
  domains.forEach(k => {
    config[k].base_path = config[k].base_path.replace(/^~/g, homedir())
  });

  // append :PORT to domains
  if(PORT != 80){
    var temp = config;
    config = {};
    domains.forEach(d => {
      config[`${d}:${PORT}`] = temp[d];
    });
  }

  return new Config(config);
};
