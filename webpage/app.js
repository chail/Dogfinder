/* app.js */

// require and instantiate express
var express = require('express')
var routes = require('./routes/routes.js');
var app = express()


app.use(express.bodyParser());
app.use(express.logger("default"));
app.use(express.cookieParser());
app.use(express.session({secret: 'worlds'}));
app.use('/', express.static(__dirname + '/public', {maxAge:1}));
app.use( express.static( "images" ) );

app.get('/', routes.get_main);
app.post('/checklogin', routes.post_checklogin);
app.post('/createaccount', routes.post_create_account);
app.post('/adddogid', routes.post_add_dog_id);
app.post('/deldogid', routes.post_del_dog_id);
app.post('/createaccount', routes.post_create_account);
app.get('/logout', routes.get_logout);
app.get('/quiz', routes.get_quiz);
app.get('/quizresults', routes.get_quiz_results);
app.get('/inputzipcode', routes.get_input_zipcode);
app.get('/nearbyzipcodes', routes.get_nearby_zipcodes);
app.get('/dogprofiles/:idnum', routes.get_dog_profile);
app.get('/twitterfeed', routes.get_twitter_feed);
app.get('/userprofiles/:username', routes.get_user_profile);


app.set('view engine', 'ejs');

app.listen(8822);
console.log('Server running on port 8822": http://localhost:8822/');