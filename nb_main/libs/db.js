"use strict";
var mongoose = require('mongoose');
var winston = require('winston');
var mongooseAutoIncrement = require('mongoose-auto-increment');

module.exports = function() {
    var self = {
        mongoose: {}
    };

    self.getMongoose = function() {
        return self.mongoose;
    };

    self.init = function(uri, options, callback) {
        mongoose.connect(uri, options);

        mongoose.connection.on('connected', function(){
            winston.info('connected to db');
        });
        mongoose.connection.on('error', function(err){
            winston.info('connect error');
            winston.error(err);
            callback(err);
        });
        mongoose.connection.on('disconnected', function(){
            winston.info('disconnected db');
            callback('disconnected db');
        });
        mongoose.connection.once('open', function() {
            winston.info('db connection opened');
            mongooseAutoIncrement.initialize(mongoose.connection);
            self.mongoose = mongoose;
            callback(null, mongoose);
        });
    };

    return self;
};