"use strict";

var path = require('path');
var moduleBase = require(path.join(LIBS_DIR, 'module'));
module.exports = function(moduleName, req, res, app) {
    var self = new moduleBase(moduleName, req, res);

    self.adminModule();

    self.main = function() {
        self.render('main', {content: 'Đây là content'});
    };

    return self;
};