"use strict"
const dateFormat = require('dateformat');
const fs         = require("fs");

const Logger = function()  {
    console.error("LOG is a static class");
}

Logger.Path = "/dev/null";

Logger.Init = function() {
    const date = dateFormat(new Date(), "H:MM_dd-mm-yy");
    Logger.Path = "./logs/" + date + ".txt";

    console.log("Log location : " + Logger.Path);
}

Logger.LOG = function( message ){
    fs.appendFileSync( Logger.Path , message + "\n");
}

module.exports = Logger;

