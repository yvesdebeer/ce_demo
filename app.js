"use strict";
// --------------------------------------------------------------------------
// Require statements
// --------------------------------------------------------------------------
var express = require("express");
var bodyParser = require("body-parser");

var os = require("os");

// --------------------------------------------------------------------------
// Useful test vars
// --------------------------------------------------------------------------
var hostname = os.hostname();

// --------------------------------------------------------------------------
// Read environment variables
// --------------------------------------------------------------------------

// When not present in the system environment variables, dotenv will take them
// from the local file
require("dotenv-defaults").config({
  path: "my.env",
  encoding: "utf8",
  defaults: "my.env.defaults",
});

// App ENV
var APP_NAME = process.env.APP_NAME;
var CLIENT_VERSION = process.env.CLIENT_VERSION;
var CLIENT_TITLE = process.env.CLIENT_TITLE;
var WELCOME_MSG = process.env.WELCOME_MSG;
var WELCOME_IMG = process.env.WELCOME_IMG;
var REGION = process.env.REGION;

// --------------------------------------------------------------------------
// Initialization App Logging
// --------------------------------------------------------------------------
console.log("INFO: Here we go ! Starting up !!!", APP_NAME);

console.log("INFO: CLIENT_VERSION", CLIENT_VERSION);
console.log("INFO: CLIENT_TITLE", CLIENT_TITLE);
console.log("INFO: WELCOME_MSG", WELCOME_MSG);
console.log("INFO: WELCOME_IMG", WELCOME_IMG);

// --------------------------------------------------------------------------
// Setup the express server
// --------------------------------------------------------------------------
var app = express();

// create application/json parser
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({
  extended: false,
});

// serve the files out of ./public as our main files
app.use(express.static(__dirname + "/public"));

// --------------------------------------------------------------------------
// Express Server runtime
// --------------------------------------------------------------------------
// Start our server !
app.listen(process.env.PORT || 8080, function () {
  console.log("INFO: app is listening on port %s", process.env.PORT || 8080);
});

// --------------------------------------------------------------------------
// REST API : health
// --------------------------------------------------------------------------
app.get("/health", function (req, res) {
  var health = {
    health: "OK",
  };
  console.log("INFO: Service health returning " + JSON.stringify(health));
  res.json(health);
});

// --------------------------------------------------------------------------
// REST API : retrieve info about the host
// --------------------------------------------------------------------------
app.get("/getEnvironment", function (req, res) {
  var hostobj = {
    hostname: hostname,
    region: REGION,
    app_name: APP_NAME,
    client_title: CLIENT_TITLE,
    client_version: CLIENT_VERSION,
    welcome_msg: WELCOME_MSG,
    welcome_img: WELCOME_IMG,
  };
  console.log(
    "INFO: Service getEnvironment returning : " + JSON.stringify(hostobj)
  );
  res.json(hostobj);
});

// --------------------------------------------------------------------------
// REST API : send error to log
// --------------------------------------------------------------------------
app.get("/senderror", function (req, res) {
  var notused = {
    zero: "zero",
  };
  console.log("ERROR: Test error message - No real error has occurred.");
  res.json(notused);
});

// --------------------------------------------------------------------------
// REST API : crash the server ... yeah ... really !
// --------------------------------------------------------------------------
app.get("/crashPod", function (req, res) {
  var hostobj = {
    hostname: hostname,
  };
  console.log("INFO: Crashing Pod " + hostname);
  res.json(hostobj);

  // This kills the server
  process.exit(1);
});

// --------------------------------------------------------------------------
// REST API : get a fibonacci number
// --------------------------------------------------------------------------
app.get("/fibo", function (req, res) {
  var fibo_number = fibo(30);

  var fiboobj = {
    fibo: fibo_number,
  };

  res.json(fiboobj);
});

// --------------------------------------------------------------------------
// Helper : fibonacci : cpu intensive function to create some load
// --------------------------------------------------------------------------
function fibo(n) {
  if (n < 2) return 1;
  else return fibo(n - 2) + fibo(n - 1);
};
