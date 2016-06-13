"use strict";

var path = require('path');
module.exports = function(initSetting) {

    //var mongoose = require('mongoose');

    /*** define user model ***/
    global.userModel = require(path.join(__dirname, 'user_model.js'))();
    /*** open database connection ***/
    //mongoose.connect('mongodb://' + db.host + '/' + db.name);

    /*** pre define variables ***/
    var self = {
        localCenter: true
    };
    /*** message storage var ***/
    self.message = {
        type: 'normal',
        content: ''
    };

    /*** pre define default module setting ***/
    var defaultSetting = {
        user_center	: 'local', //Get user via local site database
        //'user_center' 	: 'http://id.webngon.com/authentication', //Get user via via external user base
        register	: {
            path		: '/register',
            callback	: 'remoteRegisterCallback'
        },
        login			: {
            path		: '/login',
            callback	: 'remoteLoginCallBack'
        },
        reset_pass	: {
            path		: '/account_reset'
        }
    };

    /*** merge object function ***/
    self.objectMerger = function extend(target) {
        var sources = [].slice.call(arguments, 1);
        sources.forEach(function (source) {
            for (var prop in source) {
                target[prop] = source[prop];
            }
        });
        return target;
    };

    /*** generate run setting ***/
    var setting = self.objectMerger({}, defaultSetting, initSetting);

    if(setting.user_center == 'local')
        self.localCenter = true;


    /*** Usage functions ***/
    /*** check user existed ***/
    self.checkUserExisted = function(username, email) {
    };

    self.addUser = function(prefs, callback) {

        var defaultUserPrefs = {
            username: 	'',
            email: 		'',
            password: 	'',
            level: 		USER_LEVEL.MEMBER,
            status: 	'inactive'
        };

        var userPrefs = self.objectMerger({}, defaultUserPrefs, prefs);

        var createdUser = {};
        userModel.findOne( { $or: [
            {'identities.local.email': userPrefs.email},
            {'identities.local.username': userPrefs.username}
        ]
        }, function(err, user) {
            // if there are any errors, return the error
            if (err) {
                self.message = {
                    type: 'error',
                    content: err
                };
                callback(self.message, createdUser);
                return;
            }
            // check to see if theres already a user with that email
            if (user) {
                self.message = {
                    type: 'error',
                    content: 'That email or username is already taken.'
                };
                callback(err, self.message, createdUser);
                return;
            }
            else {
                // if there is no user with that email create the user
                var newUser = new userModel();
                // set the user's local credentials
                newUser.identities.local.username   = userPrefs.username;
                newUser.identities.local.email    	= userPrefs.email;
                newUser.identities.local.password 	= newUser.generateHash(userPrefs.password);
                newUser.level						= userPrefs.level;
                newUser.status						= userPrefs.status;

                // save the user
                newUser.save(function(err) {
                    if (err) throw err;
                    self.message = {
                        type: 'success',
                        content: 'Success create user'
                    };
                    createdUser = newUser;
                    callback(err, self.message, createdUser);
                    return;
                });
            }
            return;
        });

    };

    self.addFacebookUser = function(fbid, fbname, token, callback) {
        userModel.findOne( { 'identities.facebook.id': fbid}, function(err, user) {
            if (user) callback(err, user);
            else {
                var newUser = new userModel();
                newUser.identities.facebook.username    = fbid;
                newUser.identities.facebook.id    	    = fbid;
                newUser.identities.facebook.name        = fbname;
                newUser.identities.facebook.token       = token;
                newUser.detail = {
                    fullname: fbname
                };
                newUser.save(function(err, user) {
                    callback(err, user);
                });
            }
        });
    };

    self.login = function(req, usernameOrEmail, password, callback) {
        userModel.findOne({ $or: [
            {'identities.local.email': usernameOrEmail},
            {'identities.local.username': usernameOrEmail}
        ]
        }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err) {
                self.message = {
                    type: 'error',
                    content: err
                };
                callback(self.message, {});
                return;
            }

            // if no user is found, return the message
            if (!user) {
                self.message = {
                    type: 'error',
                    content: 'Người dùng không tồn tại'
                };
                callback(self.message, {});
                return;
            }

            // if the user is found but the password is wrong
            if (!user.validPassword(password)) {
                self.message = {
                    type: 'error',
                    content: 'Sai mật khẩu'
                };
                callback(self.message, {});
                return;
            }
            else {
                req.session.is_logged = true;
                user.LEVEL = user.level;
                req.session.userInfo = user;
                self.message = {
                    type: 'success',
                    content: 'Success login'
                };
                callback(self.message, user);
                return;
            }
            return;
        });
    };

    self.isLoggedIn = function(req) {
        return req.session.is_logged;
    };

    self.getLoggedInUser = function(req) {
        return req.session.user_data;
    };

    self.logout = function(req, callback) {
        req.session.destroy(function(err) {
            if(typeof callback != 'undefined') callback(err);
        });
    };

    return self;
};