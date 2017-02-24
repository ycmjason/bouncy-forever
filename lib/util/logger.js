// hybrid of sysout and fileout
var sysout = require('./sysout');
var fileout = require('./fileout');


exports.log = (s) => {
  sysout.log(s);  
  fileout.log(s);  
}

exports.error = (s) => {
  sysout.error(s);  
  fileout.error(s);  
}
