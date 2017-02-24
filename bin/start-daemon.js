#!/usr/bin/env node
if(!process.argv[2]){
  require('./start-server')();
  process.exit(0);
}

var daemon = require("daemonize2").setup({
  main: "./start-server.js",
  name: "bouncy-forever-server",
  pidfile: "./bouncy-forever-server.pid",
  argv: [''].concat(process.argv)
});
 
switch(process.argv[2]) {

  case "start":
    daemon.start();
    break;

  case "stop":
    daemon.stop();
    break;

  case "restart":
    daemon.stop(function(){
      daemon.start();
    });
    break;

  default:
    console.log("Usage: bouncyforever [start|stop|restart]");
    console.log("Usage: bouncyforever");
    break;


}
