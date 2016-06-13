"use strict";

var availableRoutes = {};
var adminRoutes = {};

module.exports = function() {
    var self = {

    };

    self.addRoute = function (name, params) {
        availableRoutes[name] = params;
    };

    self.removeRoute = function(name) {
        delete availableRoutes[name];
    };

    self.getAllRoutes = function() {
        return availableRoutes;
    };

    self.getRoutesByPath = function() {
        var routesByPath = {};

        for(var routeName in availableRoutes) {
            routesByPath[availableRoutes[routeName].path] = availableRoutes[routeName];
        }
        return routesByPath;
    };

    return self;
};