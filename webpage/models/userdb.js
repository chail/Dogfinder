var async = require('async');
var Joi = require('joi');
var SHA3 = require("crypto-js/sha3");
var vogels = require('vogels');

vogels.AWS.config.loadFromPath('./config.json');

// START USER DB FUNCTIONS
var User = vogels.define('User', {
    hashKey: 'username',

    // add the timestamp attributes (updatedAt, createdAt)
    timestamps: true,

    schema : {
        username: Joi.string(),
        password: Joi.string(),
        email: Joi.string().email(),
        savedDogIds: vogels.types.stringSet(),
    }
});


var vogelsCreateUserRecord = function(username, password, email) {
    var hashedPassword = SHA3(password).toString();
    return {
        username: username,
        password: hashedPassword,
        email: email,
        savedDogIds: '[]'
    };
};

var vogelsCreateUser = function(user, callback) {
    // check to see user with this name does not already exist
    User.get(user.username, {AttributesToGet: ['email', 'password']}, function(err, u) {
        if (err) {
            console.log(err);
            callback(err);
        } else if (u === null) {
            User.create(user, function(err1, u1) {
                if (err1) {
                    console.log('Error creating user: ', err1);
                    callback(err1);
                } else {
                    console.log('Created user account for user: ' + u1.get('email'));
                    callback(null);
                }
            });
        } else {
            // user already exists
            console.log("User with this username already exists");
            callback('Username taken');
        }
    });

};

var vogelsGetUser = function(username, callback) {
    User.get(username, function(err, user) {
        if (err) {
            console.log('Error getting user:', err);
            callback(err, null);
        } else {
            callback(null, user);
        }
    });
};

var vogelsLoginLookup = function(username, callback) {
    User.get(username, {AttributesToGet: ['password']}, function(err, user) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else if (user === null) {
            // no user with username found
            callback(null, null);
        } else {
            callback(null, user.get('password'));
        }
    });
};

var vogelsAddDogId = function(username, dogId, callback) {
    User.update({
        username : username,
        savedDogIds  : {$add : dogId}
    }, function (err, dog) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            console.log('added dog id to user', dog.get('savedDogIds'));
            callback(null, dog);
        }
    });
};

var vogelsDelDogId = function(username, dogId, callback) {
    User.update({
        username : username,
        savedDogIds  : {$del : dogId}
    }, function (err, dog) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            console.log('removed dog id to user', dog.get('savedDogIds'));
            callback(null, dog);
        }
    });
};

var vogelsCreateTables = function(callback) {
    vogels.createTables(function(err) {
        if (err) {
            console.log('Error creating tables: ', err);
            callback(err);
        } else {
            console.log('Tables have been created');
            callback(null);
        }
    });
};

var vogelsDeleteTables = function(callback) {
    var notFoundErr = 'Requested resource not found';
    User.deleteTable(function(err1) {
        if (err1 && !err1.message.startsWith(notFoundErr)) {
            console.log('Error deleting User table: ', err1);
            callback(err1);
        } else {
            console.log('All tables successfully deleted');
            callback();
        }
    });
};

module.exports = {
    createTables: vogelsCreateTables,
    deleteTables: vogelsDeleteTables,
    createUser: vogelsCreateUser,
    createUserRecord: vogelsCreateUserRecord,
    loginLookup: vogelsLoginLookup,
    getUser: vogelsGetUser,
    addDogId: vogelsAddDogId,
    delDogId: vogelsDelDogId
};
