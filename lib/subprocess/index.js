/* subprocess has the following structure:
 * {
 *   "name": "app_1",
 *   "base_path": "~/Development/app_1/",
 *   "start": "npm start"
 *   "env": {
 *     "PROD": "true", ...
 *   }
 * }
 */
var forever = require('forever-monitor');
var homedir = require('homedir');

var LOG_LOCATION = homedir() + '/.bouncy-forever/logs/';


function Subprocess(subprocess){
  // copy the properties from subprocess to this
  ['name', 'base_path', 'start_script', 'env'].forEach((p) => this[p] = subprocess[p]);

  this.child = undefined;
}

Subprocess.prototype.start = function(port, cb){
  if(this.child && this.child.running) return;

  var env = Object.assign(this.env || {}, {'PORT': port});
  var script = this.start_script.split(/ +/);
  this.child = new (forever.Monitor)(script, {
    max: 10,
    silent: true,

    env: env,
    cwd: this.base_path,

    outFile: LOG_LOCATION + `${this.name}.out.log`,
    errFile: LOG_LOCATION + `${this.name}.err.log`,
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
