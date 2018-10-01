"use strict"
const dateFormat = require('dateformat');
const fs         = require("fs");

const Logger = function()  {
    console.error("LOG is a static class");
}

Logger.Path = "/dev/null";

Logger.Init = function() {
  const date = dateFormat(new Date(), "H:MM_dd-mm-yy");
  
  Logger.Path = "./logs/log" + date + ".txt";

  console.log("Log location : " + Logger.Path);
}

Logger.LOG = function( message ){
  var timeStamp = dateFormat(new Date(), "[H:MM dd/mm/yy]  ");
  fs.appendFileSync( Logger.Path , timeStamp + message + "\n");
}

module.exports = Logger;

