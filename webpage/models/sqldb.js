var async = require('async');

// Connect string to MySQL
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'cis450db.c6bcsntxjvp9.us-east-1.rds.amazonaws.com',
    user     : 'cis450',
    port     :  '3306',
    password : 'cis450project',
    database : 'breeds_and_locations',
});

// Query the database
var sqlQueryZipcodes = function(zipcode, max_dist, callback) {
    query = "SELECT * "
        + "FROM ("
        + "SELECT Z.zipcode, 2 *  3960 *  ATAN2(SQRT(Z.A), SQRT(1-Z.A)) as dist"
        + " FROM (SELECT all_zipcodes.zipcode, "
        + "(POW(SIN(RADIANS(all_zipcodes.lat - my_zipcode.lat)/2),2)) + "
        + "COS(RADIANS(all_zipcodes.lat)) * COS(RADIANS(my_zipcode.lat)) *"
        + "(POW(SIN(RADIANS(all_zipcodes.lng - my_zipcode.lng)/2),2)) as A "
        +"FROM (SELECT * FROM Zipcode q WHERE q.is_pet_zip) all_zipcodes join (Select * from Zipcode where zipcode = '"+zipcode+"') my_zipcode) Z "
        + ") D "
        + "WHERE D.dist < " + max_dist


    console.log(query);

    connection.query(query, function(err, rows, fields) {
        if (err) {
            console.log(err);
            callback(err, null, query);
        }
        else {
            console.log("Queried for nearby zipcodes to: " + zipcode);
            callback(null, rows, query);
        }
    });
}

// Query the database
var sqlQueryBreeds = function(traits, callback) {
    val_str = ""
    for(i = 0; i < traits.length; i++){
        val_str = val_str + '('  + traits[i].value + ')';
        if(i < traits.length - 1){
            val_str = val_str + ' + ';
        }
        else {
            val_str = val_str + ' ';
        }
    }
    query = "SELECT breed," + val_str + "as score " + "FROM Breed ORDER BY score DESC LIMIT 30;"
    connection.query(query, function(err, rows, fields) {
        if (err) {
            console.log(err);
            callback(err, null, query);
        }
        else {
            console.log("Queried for breeds successfully");
            callback(null, rows, query);
        }
    });
}

module.exports = {
    queryZipcodes: sqlQueryZipcodes,
    queryBreeds: sqlQueryBreeds
};
