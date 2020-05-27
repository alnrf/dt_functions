const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./util/fbAuth');

const {
    getAllMovies,
    postNewMovie,
    getMovie,
    postNewComent
} = require('./handlers/movies');

const {
    signup,
    login,
    uploadImage,
    addUserDetails
} = require('./handlers/users');

// Movies Routes
app.get('/getAllMovies', getAllMovies);
app.post('/newMovie', FBAuth, postNewMovie);
app.get('/getMovie/:movieId', getMovie);
app.post('/movie/:movieId/comment', FBAuth, postNewComent)
// TODO: app.delete('/delete/:movieId', FBAuth, deleteMovie);
// TODO: like movie
// TODO: unlike movie

//Signup & Login routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
// app.get('/user', FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);