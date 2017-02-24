var chalk = require('chalk');

exports.log = (s) => console.log(s || '');

exports.error = (s) => console.log(chalk.red("Error: ") + (s || ''));
