#!/usr/bin/env node
var daemon = require("daemonize2").setup({
  main: "./start-server.js",
  name: "bouncy-forever-server",
  pidfile: "./bouncy-forever-server.pid"
});
 
switch (process.argv[2]) {

  case "start":
    daemon.start();
    break;

  case "stop":
    daemon.stop();
    break;

  case "restart":
    daemon.stop();
    daemon.start();
    break;

  default:
    console.log("Usage: [start|stop|restart]");
}
