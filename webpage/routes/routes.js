var SHA3 = require("crypto-js/sha3");
var sqldb = require('../models/sqldb.js');
var userdb = require('../models/userdb.js');
var petdb = require('../models/petdb.js');


var getMain = function(req, res) {
    if (req.session.username) {
        // render the homepage
        res.render('index.ejs', {loggedInUser: req.session.username});
    } else {
        // render the signup page
        var err = req.query.err;
        if (err === 'noExistingUser') {
            res.render('signup.ejs', {});
        } else if (err === 'unknown') {
            res.render('signup.ejs', {});
        } else if (err === 'usernameTaken ') {
            res.render('signup.ejs', {});
        } else if (err === 'blankField') {
            res.render('signup.ejs', {});
        } else {
            res.render('signup.ejs', {});
        }
    }
};

/* checks for valid login */
var postCheckLogin = function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    // make sure the input fields are not empty
    if (!username || !password || !username.trim() || !password.trim()) {
        res.status(400).send({error: "A user with the given email/password combo does not exist."});
        return;
    }
    var regexCheck = /^[a-zA-Z0-9._-]+$/;
    if (!regexCheck.test(username) || !regexCheck.test(password)) {
        res.status(400).send({error: "The email/password contains illegal characters."});
        return;
    }
    var hashedPassword = SHA3(password).toString();
    userdb.loginLookup(username, function(err, pwd) {
        if (err) {
            res.status(500).send({error: "An unknown error occurred. Please try again."});
        } else if (pwd) {
            if (pwd === hashedPassword) {
                // save login to session
                req.session.username = username;
                res.send({ redirect: '/' })
            } else {
                // wrong user password combo
                res.status(500).send({error: "A user with the given email/password combo does not exist."});
            }
        } else {
            // no user found in db
            res.status(500).send({error: "A user with the given email/password combo does not exist."});
        }
    });
};

// creates a new user account
var postCreateAccount = function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    // make sure the input fields are valid
    if (!username || !username.trim() || !password || !password.trim() || !email || !email.trim()) {
        res.status(400).send({error: "Please fill in all required fields"});
    } else {
        var regexCheck = /^[a-zA-Z0-9._-]+$/;
        var emailRegex = /^[a-z0-9._-]+@[a-z_-]+\.[a-z]+$/;
        if (!regexCheck.test(username) || !regexCheck.test(password) || !emailRegex.test(email)) {
            res.status(400).send({error: "One or more fields is not of the required format"});
        }
        var user = userdb.createUserRecord(username, password, email);
        userdb.createUser(user, function(err) {
            if (err === 'Username taken') {
                res.status(500).send({error: "This username has already been taken. Please choose another."});
            } else if (err) {
                res.status(500).send({error: "An unknown error occurred. Please try again."});
            } else {
                // User successfully created so update session
                req.session.username = username;
                res.send({ redirect: '/' })
            }
        });
    }
};

var postAddDogId = function (req, res) {
    if (!req.session.username) {
		res.status(401).send({error: 'User is not logged in.'});
		return;
	}
	var dogId = req.body.dogId;
	var username = req.session.username;
	userdb.addDogId(username, dogId, function (err, dog) {
        if (err) {
            res.status(500).send({error: "Unable save dog."});
        }
    });
};

var postDelDogId = function (req, res) {
    if (!req.session.username) {
        res.status(401).send({error: 'User is not logged in.'});
        return;
    }
    var dogId = req.body.dogId;
    var username = req.session.username;
    userdb.delDogId(username, dogId, function (err, dog) {
        if (err) {
            res.status(500).send({error: "Unable to delete saved dog."});
        }
    });
};


// destroys session and sets isOnline to false
var getLogout = function (req, res) {
    req.session.destroy(function (err) {
            res.redirect('/');
    });
};


// creates a new user account
var getQuiz = function (req, res) {
    if (!req.session.username) {
        res.redirect('/');
        return;
    }
    var username = req.session.username;
    var quiz_questions = [
    
        {
            id: "age",
            question: 'What age dog are you looking for?',
            answers: [
                {
                    txt: 'Any',
                    value: "1",
                    trait: 'any',
                    pic: "anyAge.jpg"
                },
                {
                    txt: 'Baby',
                    value: "1",
                    trait: 'Baby',
                    pic: "Baby.jpg"
                },
                {
                    txt: 'Young',
                    value: "1",
                    trait: 'Young',
                    pic: "young.jpg"
                },                
                {
                    txt: 'Adult',
                    value: "1",
                    trait: 'Adult',
                    pic: "adult.jpg"
                },                               
                {
                    txt: 'Senior',
                    value: "1",
                    trait: 'Senior',
                    pic: "old.jpg"
                },

            ]
        },
        {
            id: 'gender',
            question: 'Do you want a male or female dog?',
            answers: [
                 {
                    txt: 'Either',
                    value: "0",
                    trait: 'either',
                    pic: "anyGender.jpg"
                 },                 
                 {
                    txt: 'Male',
                    value: "0",
                    trait: 'Male',
                    pic: "male.jpg"
                 },                 
                 {
                    txt: 'Female',
                    value: "0",
                    trait: 'Female',
                    pic: "female.jpg"
                 }
             
             ]
        },
        
        {
            id: 'mixed',
            question: "Is a mixed-breed dog okay?",
            answers: [
                {
                    txt: 'Yes',
                    value: '0',
                    trait: 'True',
                    pic: 'mutt.jpg'
                },
                
                {
                    txt: 'No',
                    value: '0',
                    trait: 'False',
                    pic: 'pure.jpg'
                    
                }
            ]
        },
        
        {
            id: "home",
            question: 'Where do you live?',
            answers: [
                {
                    txt: 'House',
                    value: "0",
                    trait: '1',
                    pic: "house.jpg"
                },
                {
                    txt: 'Apartment',
                    value: "2",
                    trait: 'goodForApartment',
                    pic: "apartment.jpg"
                },

            ]
        },
        {
            id: "activity",
            question: 'What would you like to do with your dog?',
            answers: [
                {
                    txt: 'Run/Walk',
                    value: "1",
                    trait: 'activityLevel',
                    pic: "run.jpg"
                },
                {
                    txt: 'Play Fetch',
                    value: "1",
                    trait: 'likesFetch',
                    pic: "fetch.jpg"
                },
                {
                    txt: 'Relax',
                    value: "-1",
                    trait: 'activityLevel',
                    pic: "relax.jpg"
                },

            ]
        },

        {
            id: "socialness",
            question: 'Do you prefer ...',
            answers: [
                {
                    txt: 'Being Alone',
                    value: "1",
                    trait: 'toleratesBeingAlone',
                    pic: "alone.jpg"
                },
                {
                    txt: 'Being with Anyone',
                    value: "1",
                    trait: 'likesStrangers',
                    pic: "anyone.jpg"
                },
                {
                    txt: 'Being with Family',
                    value: "1",
                    trait: 'likesFamily',
                    pic: "family.jpg"
                },

            ]
        },


        {
            id: "temperature",
            question: 'Would you rather be ...',
            answers: [
                {
                    txt: 'somewhere hot',
                    value: "1",
                    trait: 'toleratesHot',
                    pic: "hot.jpg"
                },
                {
                    txt: 'somewhere cold',
                    value: "1",
                    trait: 'toleratesCold',
                    pic: "cold.jpg"
                }

            ]
        },

        {
            id: "otherDogs",
            question: 'Do you have other dogs?',
            answers: [
                {
                    txt: 'yes',
                    value: "1",
                    trait: 'likesDogs',
                    pic: "lots of dogs.jpg"
                },
                {
                    txt: 'no',
                    value: "0",
                    trait: '1',
                    pic: "noPets.jpg"
                }

            ]
        },

        {
            id: "otherNonDogs",
            question: 'Do you have other non-dog pets?',
            answers: [
                {
                    txt: 'yes',
                    value: "-1",
                    trait: 'preyDrive',
                    pic: "otherPets.jpg"
                },
                {
                    txt: 'no',
                    value: "0",
                    trait: '1',
                    pic: "noPets.jpg"
                }

            ]
        },

        {
            id: "obedience",
            question: 'Are you good at following instructions?',
            answers: [
                {
                    txt: 'yes',
                    value: "1",
                    trait: 'trainability',
                    pic: "trainable.jpg"
                },
                {
                    txt: 'not so much',
                    value: "0",
                    trait: '1',
                    pic: "untrainable.jpg"
                }

            ]
        },

        {
            id: "intelligence",
            question: 'Do you value intelligence?',
            answers: [
                {
                    txt: 'yes',
                    value: "1",
                    trait: 'intelligent',
                    pic: "smart.jpg"
                },

                {
                    txt: 'not really',
                    value: "0",
                    trait: '1',
                    pic: "middle_1.jpg"
                },
                {
                    txt: 'seems like a draw back',
                    value: "-1",
                    trait: "intelligent",
                    pic: "notSmart.jpg"
                }

            ]
        }
    ]
    res.render('quiz.ejs', {questions:quiz_questions, loggedInUser: req.session.username});
};

// creates a new user account
var getQuizResults = function (req, res) {
    if (!req.session.username) {
        res.redirect('/');
        return;
    }
    var username = req.session.username;
    var traits = [
        {
            name: 'home',
            value: req.query.home
        },
        {
            name: 'activity',
            value: req.query.activity
        },
        {
            name: 'socialness',
            value: req.query.socialness
        },
        {
            name: 'temperature',
            value: req.query.temperature
        },
        {
            name: 'otherDogs',
            value: req.query.otherDogs
        },
        {
            name: 'otherNonDogs',
            value: req.query.otherNonDogs
        },
        {
            name: 'obedience',
            value: req.query.obedience
        },
        {
            name: 'intelligence',
            value: req.query.intelligence
        }
    ];
    
    var gender;
    if(req.query.gender == "0 * either"){
        gender = null;
    } else {
        gender = req.query.gender.charAt(4);
    }
    
    var age;
    if(req.query.age == "1 * any") {
        age = null;
    } else {
        age = [req.query.age.substr(4)];
    }
    
    var muttOkay = false;
    if(req.query.mixed.trait == "True"){
        muttOkay = null;
    }
    
		var options = [];
		if (req.query.otherDogs == "1 * likesDogs") {
			options.push("noDogs");
		}
		if (req.query.otherNonDogs == "-1 * preyDrive") {
			options.push("noCats");
		}
		console.log(options);
        
        
    sqldb.queryBreeds(traits, function(err, breed_rows, query){
        if (err) {
            console.log(err);
        } else if (breed_rows && query) {
					
          var breeds = []
					for (var i = 0; i < breed_rows.length; i++) {
						breeds.push(breed_rows[i].breed);
					}
					console.log(breeds);
					var zipcode = req.query.zipcode;
                    var max_dist = req.query.max_dist;
                    sqldb.queryZipcodes(zipcode, max_dist, function(err, rows, query){
                        if (err) {
                            console.log(err);
                        } else if (rows && query) {
                            var zipcodes = []
                            for (var i = 0; i < rows.length; i++) {
                                zipcodes.push(parseInt(rows[i].zipcode));
                            }
                            console.log(zipcodes);
                            petdb.getPetsByCharacteristics(zipcodes, age, breeds, null, gender, muttOkay,
                                function(err, pets) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log("Succeeded");
                                        console.log(pets[0]);
                                        console.log(pets.length);
                                        res.render('quiz_results.ejs', {rows:breed_rows, pets:pets,
                                            loggedInUser: req.session.username});
                                    }
                                }
                            );
                        }
                    });
        }
    });
};

var getInputZipcode = function (req, res) {
    if (!req.session.username) {
        res.redirect('/');
        return;
    }
    res.render('input_zipcode.ejs', {loggedInUser: req.session.username});
};

var getNearbyZipcodes = function (req, res) {
    if (!req.session.username) {
        res.redirect('/');
        return;
    }
    var zipcode = req.query.zipcode;
    var max_dist = req.query.max_dist;
    sqldb.queryZipcodes(zipcode, max_dist, function(err, rows, query){
        if (err) {
            console.log(err);
        } else if (rows && query) {
					var zipcodes = []
					for (var i = 0; i < rows.length; i++) {
						zipcodes.push(parseInt(rows[i].zipcode));
					}
					console.log(zipcodes);
					petdb.getPetsByCharacteristics(zipcodes, null, null, null, null, null,
						function(err, pets) {
							if (err) {
								console.log(err);
							} else {
								console.log("Succeeded");
								console.log(pets[0]);
								console.log(pets.length);
                res.render('dogs.ejs', {pets: pets,
									loggedInUser: req.session.username});
							}
						});
        }
    });
};

var getDogProfile = function (req, res) {
    if (!req.session.username) {
        res.redirect('/');
        return;
    }
    var idnum;
    if (req.params.idnum) {
        idnum = parseInt(req.params.idnum);
    }
    petdb.getPetById(idnum, function(err, pet) {
        if (err) {
            res.status(500).send({error: "An unknown error occurred. Please reload the page."});
        } else {
            res.render('dog_profile.ejs', {pet: pet, loggedInUser: req.session.username});
        }
    });
};

var getTwitterFeed = function (req, res) {
    if (!req.session.username) {
        res.redirect('/');
        return;
    }
    res.render('twitter_feed.ejs', {loggedInUser: req.session.username});
};

var getUserProfile = function (req, res) {
    if (!req.session.username) {
        res.redirect('/');
        return;
    }

    var username;
    if (req.params.username) {
        username = req.params.username;
    }

    userdb.getUser(username, function(err, user) {
       if (err) {
           res.status(500).send({error: "Unable to fetch user"});
       } else if (user) {
           res.render('user_profile.ejs', {savedDogIds: user.get('savedDogIds'), loggedInUser: req.session.username});
       }
    });
};

var routes = {
    get_main: getMain,
    post_checklogin: postCheckLogin,
    post_create_account: postCreateAccount,
    post_add_dog_id: postAddDogId,
    post_del_dog_id: postDelDogId,
    get_logout: getLogout,
    get_quiz: getQuiz,
    get_quiz_results: getQuizResults,
    get_input_zipcode: getInputZipcode,
    get_nearby_zipcodes: getNearbyZipcodes,
    get_dog_profile: getDogProfile,
    get_twitter_feed: getTwitterFeed,
    get_user_profile: getUserProfile
};

module.exports = routes;
