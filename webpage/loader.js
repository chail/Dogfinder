var async = require('async');
var vogeldb = require('./models/userdb.js');

/* Here is our initial data. */

var users =
    [vogeldb.createUserRecord('jordan', 'hello', 'jordan@gmail.com'),
     vogeldb.createUserRecord('cole', 'goodbye', 'cole@gmail.com')];

/* This function uploads the users table data */
var uploadData = function() {
    async.forEach(users, function (user, callback) {
        console.log("Adding user: " + user.email);
        vogeldb.createUser(user, function(){
            callback();
        });
    }, function(){});
};

vogeldb.deleteTables(function(err) {
    if (!err) {
        vogeldb.createTables(function(err1) {
            if (!err1) {
                uploadData();
            }
        });
    }
});
