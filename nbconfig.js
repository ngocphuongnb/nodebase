"use strict";
module.exports = {
    db: {
        type: 'mongodb',
        connectUri: 'mongodb://nodeblog_user:123456789@localhost/nodeblog',
        dbOptions: {
            poolSize: 10
        }
    },
    preload: {
        port: 3000,
        theme: 'nb-flat'
    }
};