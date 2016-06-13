"use strict";

global.APP_DIR = __dirname;
global.appConfigFile = '/nbconfig.js';
var nodeblog = require(__dirname + '/nb_main/main')();
nodeblog.init();
nodeblog.start();