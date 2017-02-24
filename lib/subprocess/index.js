/* subprocess has the following structure:
 * {
 *   "name": "app_1",
 *   "base_dir": "~/Development/app_1/",
 *   "start": "npm start"
 *   "env": {
 *     "PROD": "true", ...
 *   }
 * }
 */
var forever = require('forever-monitor');
var mkpath = require('mkpath').sync;
var homedir = require('homedir');

var LOG_LOCATION = homedir() + '/.bouncy-forever/logs';
mkpath(LOG_LOCATION);


function Subprocess(subprocess){
  // copy the properties from subprocess to this
  ['name', 'base_dir', 'start_script', 'env'].forEach((p) => this[p] = subprocess[p]);

  this.child = undefined;
}

Subprocess.prototype.start = function(port, cb){
  if(this.child && this.child.running) return;

  var log_location = `${LOG_LOCATION}/${this.name}`;
  mkpath(log_location);

  var env = Object.assign(this.env || {}, {'PORT': port});
  var script = this.start_script.replace(/\$PORT/g, port).split(/ +/);
  this.child = new (forever.Monitor)(script, {
    max: 10,
    silent: true,

    env: env,
    cwd: this.base_dir,

    outFile: `${log_location}/out.log`,
    err: `${log_location}/err.log`,

  });

  if(cb) this.child.on('start', cb);

  this.child.start();
};

Subprocess.prototype.restart = function(){
  if(!this.child) return;
  this.child.restart();
};

Subprocess.prototype.stop = function(){
  if(!this.child) return;
  this.child.stop();
}

module.exports = function(subprocess){
  return new Subprocess(subprocess);
}
