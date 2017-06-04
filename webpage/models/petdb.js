var AWS = require("aws-sdk");

AWS.config.loadFromPath('./config.json')

var docClient = new AWS.DynamoDB.DocumentClient();


/* helper functions */

function createRange(num) {
    var range_list = [];
    for (var i = 0; i < num; i++) {
        range_list.push(i);
    }
    return range_list;
}

function setvalues(valueslist, attr_dict, prefix) {
    for (var i = 0; i < valueslist.length; i++) {
        attr_dict[prefix + i] = valueslist[i];
    }
}


/* pets dynamodb queries */

// query based in id number
var queryOnIdNum = function(num, callback) {
	var matchedPets = [];

    var params = {
        TableName : "pets",
        KeyConditionExpression: "#id = :num",
        ExpressionAttributeNames:{
            "#id": "idnum"
        },
        ExpressionAttributeValues: {
            ":num": num
        }
    };

    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            callback(err, null);
        } else {
            console.log("Query succeeded.");
            data.Items.forEach(function(item) {
                matchedPets.push(item);
            });
            callback(null, matchedPets);
        }
    });

}

/* find pet given specific attributes
INPUTS:
    zipcodelist: list of integers or null
    agelist: list of strings or null, allowable values: "Baby", "Young", "Adult", or "Senior"
    breedlist: list of strings or null
    optionsList: list of strings
    sex: string or null, allowable values: "M" or "F"
    mix: boolean, true or false
OUTPUTS:
    list of pet documents satisfying the input conditions
*/


var findPets = function (zipcodelist, agelist, breedlist, optionslist, sex, mix, results_callback) {
    var attr_values = {}
    var range_list = [];
    var filter_strings = [];
		var matchedPets = [];

    // set up zip code query
    if (zipcodelist) {
        filter_strings.push("(zipcode in (:val" + 
            createRange(zipcodelist.length).join(", :val") + "))");
        setvalues(zipcodelist, attr_values, ":val");
    }

    // set up breeds query
    if (breedlist) {
        filter_strings.push("(contains(breeds, :breed" +
            createRange(breedlist.length).join(") or contains(breeds, :breed") + "))");
        setvalues(breedlist, attr_values, ":breed")
    }

    // set up age query
    if (agelist) {
        filter_strings.push("(age in (:age" +
            createRange(agelist.length).join(", :age") + "))");
        setvalues(agelist, attr_values, ":age")
    }

    // set up options query
    if (optionslist) {
				if (optionslist.length > 0) {
						filter_strings.push("(contains(options, :option" +
								createRange(optionslist.length).join(") or contains(options, :option") + "))");
						setvalues(optionslist, attr_values, ":option")
				}
    }

    // set up sex query
    if (sex) {
        filter_strings.push("(sex = :sex)");
        attr_values[":sex"] = sex;
    }

    // set up mix query
    if (mix) {
        filter_strings.push("(mix = :mix)");
        attr_values[":mix"] = mix;
    }

    var query_string = filter_strings.join(" AND ");
		console.log(query_string);

    // set up query
    var params = {
        TableName: "pets",
        ProjectionExpression: "zipcode, #n, city, #st, photos, idnum, breeds",
				ExpressionAttributeNames:{
						"#st": "state",
						"#n": "name"
				},
        FilterExpression: query_string,
        ExpressionAttributeValues: attr_values
    };

    console.log("Scanning PetRecords table.");

    // query database
    docClient.scan(params, function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
            results_callback(err, null);
        } else {

            // append to result
            console.log("Scan succeeded.");
            data.Items.forEach(function(item) {
               console.log(
                    item.zipcode + ": " +
                    item.idnum + ": " + item.name);
               matchedPets.push(item);
            });

            // continue scanning if we have more movies, because
            // scan can retrieve a maximum of 1MB of data
            if (typeof data.LastEvaluatedKey != "undefined") {
                console.log("Scanning for more...");
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(params, onScan);
            } else { // completed
                results_callback(null, matchedPets);
            }
        }
    });

};

module.exports = {
	getPetsByCharacteristics: findPets,
	getPetById: queryOnIdNum
};
