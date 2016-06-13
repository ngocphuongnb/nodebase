"use strict";

var fs = require('fs');
var helper = {};
helper.isFileExisted = function(filePath) {
    var isFileExisted = false;
    try {
        fs.statSync(filePath);
        isFileExisted = true;
    }
    catch(e) {
        isFileExisted = false;
    }
    return isFileExisted;
};

helper.isEmptyObject = function(obj) {
    for(var key in obj)
        if(Object.prototype.hasOwnProperty.call(obj, key))
            return false;
    return true;
};

String.prototype.startWith = function(needle) {
    return this.lastIndexOf(needle, 0) === 0
};

module.exports = helper;