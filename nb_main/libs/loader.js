"use strict";

var path = require('path');
var fs = require('fs');
var async = require('async');
var helper = require('./helper');
var emitter = require('./eventEmitter');
var dispatcher = require('./dispatcher')();
var winston = require('winston');

var extRootDir = path.join(ROOT_DIR, '/node_modules');
var extAppDir = path.join(APP_DIR, '/node_modules');

var availableExtensions = [];
var loadedExtPackgage = {};
var loadedExtensions = {};

var initExtensionHooks = function(extDef, nb, cb) {
    var extInfo = extDef.split('***');
    if(typeof extInfo[1] === 'undefined') return cb();
    var extName = extInfo[1];
    var extLoc = (extInfo[0] === 'app') ? extAppDir : extRootDir;
    var extPath = path.join(extLoc, extName);
    var extPackageFile = path.join(extPath, 'package.json');
    var extPackageObj = require(extPackageFile);
    loadedExtPackgage[extName] = require(extPackageFile);
    loadedExtensions[extName] = require(path.join(extPath, extPackageObj.main))();
    if(typeof loadedExtPackgage[extName].nodeblog.hooks != 'undefined') {
        async.eachSeries(loadedExtPackgage[extName].nodeblog.hooks, function(extHook, cb) {
            if(extHook.hookOn == 'nodeblog:loader:init') {
                emitter.on(extHook.hookOn, function(nb) {
                    loadedExtensions[extName][extHook.method](nb);
                });
            }
            else emitter.on(extHook.hookOn, loadedExtensions[extName][extHook.method]);
            cb(null);
        }, function() {
            cb();
        });
    }
};

var loadExtensions = function(callback, nb) {
    async.waterfall([
        function(next) {
            fs.readdir(extRootDir, function(err, exts) {
                if(!err) {
                    async.eachSeries(exts, function(ext, cb) {
                        var extPackageFile = path.join(extRootDir, ext + '/package.json');
                        if(helper.isFileExisted(extPackageFile) && ext.startWith('nodeblog-ext-'))
                            availableExtensions.push('root***' + ext);
                        cb(null);
                    }, function() {
                        next(null);
                    });
                }
                else next(null);
            });
        },
        function(next) {
            fs.readdir(extAppDir, function(err, exts) {
                if(!err) {
                    async.eachSeries(exts, function(ext, cb) {
                        var extPackageFile = path.join(extAppDir, ext + '/package.json');
                        if(helper.isFileExisted(extPackageFile)  && ext.startWith('nodeblog-ext-'))
                            availableExtensions.push('app***' + ext);
                        cb(null);
                    }, function() {
                        next(null);
                    });
                }
                else next(null);
            });
        }
    ], function() {
        async.eachSeries(availableExtensions, function(extDef, cb) {
            initExtensionHooks(extDef, nb, function() {
                cb(null);
            });
        }, function() {
            winston.info('Node blog Ready');
            emitter.emit('nodeblog:loader:init', nb);
            callback(null);
        });
    });

};

var nbLoader = function() {
    var self = {};
    self.init = function(nb) {
        async.parallel([
            function(cb) {
                loadExtensions(cb, nb);
            },
            function(cb) {
                nb.app.use(function (req, res, next) {
                    if(typeof req.session.userInfo == 'undefined')
                        req.session.userInfo = {
                            LEVEL: USER_LEVEL.GUEST,
                            is_loggedIn: false
                        };
                    next();
                });
                cb();
            }
        ], function() {
            console.log('okk');
            dispatcher.requestMapper(nb);
        });

    };
    return self;
};

module.exports = nbLoader();