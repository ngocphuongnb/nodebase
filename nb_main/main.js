"use strict";

var winston = require('winston');
var helper = require(__dirname + '/libs/helper');
var async = require('async');
var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');
var connectFlash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var expressPoweredBy = require('express-powered-by');
var net = require('net');
var path = require('path');
require('marko/express');
require('marko/node-require').install();
var serveStatic = require('serve-static');
var lasso = require('lasso');

global.ROOT_DIR = __dirname;
global.LIBS_DIR = path.join(ROOT_DIR, 'libs');

lasso.configure(path.join(APP_DIR, 'lasso-config.json'));
global.USER_LEVEL = {
    GUEST: 0,
    MEMBER: 1,
    MODERATOR: 2,
    SUPER_MODERATOR: 3,
    ADMINISTRATOR: 4,
    SPECIAL_PERMISSION: {}
};
var nbLoader = require(path.join(LIBS_DIR, 'loader'));
var db = require(path.join(LIBS_DIR, 'db'))();

/*** initializing needed variables ***/
var appConfigs = {};
if(helper.isFileExisted(APP_DIR + appConfigFile))
    appConfigs = require(APP_DIR + appConfigFile);

var nb_main = function() {
    var nb = {
        APP_DIR: APP_DIR,
        ROOT_DIR: ROOT_DIR,
        isAppValid: false,
        appErrors: [],
        app: {},
        express: {},
        winston: {},
        async: {},
        helper: {},
        appConfigs: appConfigs
    };

    nb.init = function() {
        nb.winston = winston;
        nb.winston.info('Initializing nodeblog!!!');
        nb.helper = helper;
        nb.async = async;
        nb.express = express;
        nb.app = nb.express();
        nb.setEnv();
    };

    nb.setEnv = function() {
        if(helper.isEmptyObject(nb.appConfigs)) {
            nb.appErrors.push('Missing app configurations');
            return;
        }
        else {
            nb.isAppValid = true;
            nb.app.enable('trust proxy');
            nb.app.use(bodyParser.json({limit: '50mb'}));
            nb.app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
            nb.app.disable('x-powered-by');
            nb.app.use(expressPoweredBy('Node.js/NodeBlog 1.0.0'));
            nb.app.use(compression());
            nb.app.use(connectFlash());
            nb.app.use('/data', serveStatic(APP_DIR + '/data'));
        }
    };

    nb.checkValidPort = function(callback) {
        var server = net.createServer(function(socket) {
            socket.write('Echo server\r\n');
            socket.pipe(socket);
        });

        server.listen(nb.appConfigs.preload.port, '127.0.0.1');
        server.on('error', function (e) {
            nb.winston.error('Port already in used');
            callback(null);
        });
        server.on('listening', function (e) {
            server.close();
            nb.winston.info('Port is free');
            callback(e);
        });
    };

    nb.checkValidPreload = function(callback) {
        callback(null);
    };

    nb.initDb = function(callback) {
        /*** Setup database conenction ***/
        db.init(nb.appConfigs.db.connectUri, nb.appConfigs.db.options, function(err, mongoose) {
            nb.app.use(session({
                secret: 'n0d35l09s3c4e7',
                saveUninitialized: false,
                resave: false,
                store: new MongoStore({
                    mongooseConnection: mongoose.connection,
                    autoRemove: 'interval'
                })
            }));
            callback(null);
        });
    };

    nb.start = function() {
        if(!nb.isAppValid) {
            nb.winston.error(nb.appErrors);
            return;
        }

        async.waterfall([
            nb.checkValidPort,
            nb.checkValidPreload,
            nb.initDb
        ], function() {
            nb.winston.info('Nodeblog is starting now!');
            nbLoader.init(nb);
            nb.app.get('/', function (req, res) {
                res.send('Hello World')
            });
            nb.app.listen(3000);
        });
    };
    return nb;
};
module.exports = nb_main;