var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    identities: {
        local   : {
            username    : String,
            email       : String,
            password    : String
        },
        facebook        : {
            id          : String,
            token       : String,
            email       : String,
            name        : String
        },
        twitter         : {
            id          : String,
            token       : String,
            displayName : String,
            username    : String
        },
        google          : {
            id          : String,
            token       : String,
            email       : String,
            name        : String
        }
    },
    detail:     {
        firstname       : String,
        lastname        : String,
        fullname        : String,
        phone           : String,
        address         : String,
        avatar          : String
    },
    level:      {type: Number, enum: [0, 1, 2, 3]},
    status:     {type: String, enum: ['inactive', 'suspended', 'hidden', 'warning', 'active']},
    roles:      {

    }
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.identities.local.password);
};

// create the model for users and expose it to our app
module.exports = function() {
    return mongoose.model('User', userSchema);
};