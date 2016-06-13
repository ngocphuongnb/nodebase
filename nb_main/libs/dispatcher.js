"use strict";

var path = require('path');
var router = require(path.join(LIBS_DIR, 'router.js'))();
var helper = require('./helper');

var moduleRootDir = path.join(ROOT_DIR, '/node_modules');
var moduleAppDir = path.join(APP_DIR, '/node_modules');

module.exports = function() {
    var self = {
        originalUrl: '',
        url: '',
        routeByPaths: {},
        routeObj: {},
        currentRoute: {}
    };
    self.requestMapper = function(nb) {
        var allRoutes = router.getAllRoutes();
        for(var routeName in allRoutes) {
            var route = allRoutes[routeName];
            if(typeof route.params_handle != 'undefined') {
                for (var param_key in route.params_handle)
                    nb.app.param(param_key, route.params_handle[param_key]);
            }
            var app_route = nb.app.route(route.path);
            app_route.get(function(req, res, next) {
                next();
            }, self.moduleLoader);
            app_route.post(function(req, res, next) {
                next();
            }, self.moduleLoader);
        }
    };

    self.moduleLoader = function(req, res, next) {
        self.originalUrl = req.originalUrl;
        self.url = req.url;
        var routesByPath = router.getRoutesByPath();
        if(typeof routesByPath[req.route.path] != 'undefined') {
            self.routeObj = routesByPath[req.route.path];
            self.currentRoute = self.routeObj;
        }

        var removeParams = req.route.path.split('?');
        self.routeObj.format = removeParams[0];
        self.routeObj.path = req.originalUrl;

        if(req.method == 'GET') {
            if(typeof self.currentRoute.get != 'undefined' && self.currentRoute.get != '') {
                var getActions = self.currentRoute.get.split(':');
                self.currentModule = getActions[0];
                self.currentAction = typeof getActions[1] != 'undefined' ? getActions[1] : 'main';
                self.loadModuleFunctions(self.currentModule, req, res, function(moduleObj) {
                    if(typeof moduleObj[self.currentAction] != 'undefined')
                        moduleObj[self.currentAction](req, res, next);
                });
            }
        }
        else if(req.method == 'POST') {
            if(typeof self.currentRoute.post != 'undefined' && self.currentRoute.post != '') {
                var getActions = self.currentRoute.post.split(':');
                self.currentModule = getActions[0];
                self.currentAction = typeof getActions[1] != 'undefined' ? getActions[1] : 'main';
                self.loadModuleFunctions(self.currentModule, req, res, function(moduleObj) {
                    if(typeof moduleObj[self.currentAction] != 'undefined')
                        moduleObj[self.currentAction](req, res, next);
                });
            }
        }
    };

    self.getProfile = function() {
        return self.currentProfile;
    };

    self.getCurrentModuleName = function() {
        return self.currentModule;
    };

    self.loadModuleFunctions = function(moduleName, req, res, cb) {
        var appModule = moduleAppDir + '/nodeblog-module-' + moduleName;
        var rootModule = moduleRootDir + '/nodeblog-module-' + moduleName;
        var returnObj = {};
        if(helper.isFileExisted(appModule)) {
            var modulePackageFile = path.join(appModule, 'package.json');
            var modulePackageObj = require(modulePackageFile);
            cb(require(path.join(appModule, modulePackageObj.main))('app***' + moduleName, req, res));
        }
        else if(helper.isFileExisted(rootModule)) {
            var modulePackageFile = path.join(rootModule, 'package.json');
            var modulePackageObj = require(modulePackageFile);
            cb(require(path.join(rootModule, modulePackageObj.main))('root***' + moduleName, req, res));
        }
        else self.notfoundPage(req, res);
        cb(returnObj);
    };

    self.notfoundPage = function(req, res) {
        res.end('Not found');
    };

    return self;
};