"use strict";

var registeredLangFiles = [];
var nbLang = function() {
    var self = {};

    self.addLangFile = function(filePath) {
        registeredLangFiles.push(filePath);
    }
};