"use strict";

var path = require('path');
var helper = require('./helper');
var appConfigs = require(APP_DIR + appConfigFile);
var g = require(path.join(LIBS_DIR, 'global'));
module.exports = function(moduleName, req, res) {
    var isAdminModule = false;
    var themeDir = '';
    var moduleInfo = moduleName.split('***');
    var moduleDir = (moduleInfo[0] == 'app') ? path.join(APP_DIR, '/node_modules/' + moduleInfo[1]) : path.join(ROOT_DIR, '/node_modules' + moduleInfo[1]);
    if(moduleInfo[0] == 'admin') {
        moduleDir = path.join(ROOT_DIR, '/admin/modules/' + moduleInfo[1]);
        isAdminModule = true;
    }
    var moduleViewDir = path.join(moduleDir, 'views');
    var self = {
        dependencies: [],
        theme: appConfigs.preload.theme
    };

    self.adminModule = function () {
        self.theme = 'nb-admin'
    };
    self.addDependencies = function(dpsfile) {
        self.dependencies.push(dpsfile);
    };
    self.render = function(file, data) {
        if(typeof data == 'undefined') data = {};
        var common = {
            view: {},
            dependencies: [],
            moduleData: {}
        };

        var appThemeViewFile = APP_DIR + '/themes/' + self.theme + '/modules/' + moduleInfo[1] + '/' + file + '.marko';
        var rootThemeViewFile = ROOT_DIR + '/themes/' + self.theme + '/modules/' + moduleInfo[1] + '/' + file + '.marko';
        var moduleViewFile = moduleViewDir + '/' + file + '.marko';
        var viewFile = moduleViewFile;
        if(helper.isFileExisted(appThemeViewFile)) {
            viewFile = appThemeViewFile;
            themeDir = APP_DIR + '/themes/' + self.theme;
            if(helper.isFileExisted(APP_DIR + '/themes/' + self.theme + '/dependencies.js'))
                common.dependencies = require(APP_DIR + '/themes/' + self.theme + '/dependencies.js').dependencies;
        }
        else if(helper.isFileExisted(rootThemeViewFile)) {
            viewFile = rootThemeViewFile;
            themeDir = ROOT_DIR + '/themes/' + self.theme;
            if(helper.isFileExisted(ROOT_DIR + '/themes/' + self.theme + '/dependencies.js'))
                common.dependencies = require(ROOT_DIR + '/themes/' + self.theme + '/dependencies.js').dependencies;
        }
        common.dependencies = common.dependencies.concat(self.dependencies);
        common.moduleData = data;

        common.lassoPackage = ROOT_DIR + '/themes/' + self.theme + '/browser.json';
        common.viewDir = path.join(themeDir, 'views');
        common.view.header = require(path.join(themeDir, 'views/header.marko'));
        common.view.footer = require(path.join(themeDir, 'views/footer.marko'));
        if(isAdminModule) {
            common.view.sidebar = require(path.join(themeDir, 'views/sidebar.marko'))
        }
        common.view.module = require(viewFile);
        var layoutTpl = require(path.join(themeDir, 'views/' + g.layout + '.marko'));

        layoutTpl.render(common, function(err, html) {
            res.end(html);
        });
        //res.marko(tpl, data);
    };
    return self;
};