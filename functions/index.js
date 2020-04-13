const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();
admin.initializeApp();

const config = {
    apiKey: "AIzaSyCisQWZk9dOgQ-UGneQurDcJgkPoLSzAB0",
    authDomain: "biblioteca-207ae.firebaseapp.com",
    databaseURL: "https://biblioteca-207ae.firebaseio.com",
    projectId: "biblioteca-207ae",
    storageBucket: "biblioteca-207ae.appspot.com",
    messagingSenderId: "362739539596",
    appId: "1:362739539596:web:d9cbfc2e76013c62"
  };

const firebase = require('firebase');
firebase.initializeApp(config);

const db = admin.firestore();

app.get('/getMovies', (req, res) => {
    db
    .collection('media')
    .orderBy('title_pt', 'asc')
    .get().then((data) => {
        let movies = [];
        data.forEach((doc) => {
            movies.push({
                movieId: doc.id,
                title_pt: doc.data().title_pt,
                title_eng: doc.data().title_eng,
                category: doc.data().category,
                year: doc.data().year,
                cover: doc.data().cover,
                media_type: doc.data().media_type,
                package: doc.data().package,
                season: doc.data().season,
                date: doc.data().date    
            });
        });
        return res.json(movies);
    })
    .catch((err) => console.log(err));
});

app.post('/newMovie',(req, res) => {
    const newMovie = {
        category: req.body.category,
        cover: req.body.cover,
        date: new Date().toISOString(),
        media_type: req.body.media_type,
        package: req.body.package,
        season: req.body.season,
        title_eng: req.body.title_eng,
        title_pt: req.body.title_pt,
        year: req.body.year
    };

    db
        .collection('media')
        .add(newMovie)
        .then((doc) => {
            res.json({ message: `O documento ${doc.id} foi criado com sucesso!` });
        })
        .catch((err) => {
            res.status(500).json({ error: 'Algo deu errado!' });
            console.log(err);
        });
});

//Rota de Sign-up
app.post('/signup', (req,res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };

    db.doc(`/users/${newUser.handle}`).get()
    .then(doc => {
        if(doc.exists){
            return res.status(400).json({ handle: 'Este handle já foi usado'});
        } else {
            return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
        }
    })
    .then((data) => {
        return data.user.getIdToken();
    })
    .then((token) => {
        return res.status(201).json({ token });
    })
    .catch((err) => {
        console.error(err);
        return res.status(500).json({err: err.code});
    });      
});

exports.api = functions.https.onRequest(app);