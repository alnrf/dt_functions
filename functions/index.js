const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth');

const { getAllMovies, postNewMovie } = require('./handlers/movies');

const { signup, login, uploadImage, addUserDetails } = require('./handlers/users');

// Movies Routes
app.get('/getMovies', getAllMovies );
app.post('/newMovie', FBAuth, postNewMovie);

//Signup & Login routes
app.post('/signup', signup );
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
// app.get('/user', FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);