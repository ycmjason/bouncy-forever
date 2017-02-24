var fs = require('fs');

var chalk = require('chalk');

var LOG_FILE = `/tmp/bouncy-forever.log`

function log_to_file(s){
  s = s || '';
  s += '\n';
  fs.writeFileSync(LOG_FILE, s, {
    flag: 'a+'
  });
}

exports.log = (s) => log_to_file(s);

exports.error = (s) => log_to_file(chalk.red(`Error: ${s}`));
