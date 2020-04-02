const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});


exports.getMovies = functions.https.onRequest((req, res) => {
    admin
        .firestore()
        .collection('media')
        .get().then((data) => {
            let movies = [];
            data.forEach((doc) => {
                movies.push(doc.data());
            });
            return res.json(movies);
        })
        .catch((err) => console.log(err));
});

exports.addMovie = functions.https.onRequest((req, res) => {
    const newMovie = {
        category: req.body.category,
        cover: req.body.cover,
        date: admin.firestore.Timestamp.fromDate(new Date()),
        media_type: req.body.media_type,
        package: req.body.package,
        season: req.body.season,
        title_eng: req.body.title_eng,
        title_pt: req.body.title_pt,
        year: req.body.year
    };

    admin
        .firestore()
        .collection('media')
        .add(newMovie)
        .then((doc) => {
            res.json({ message: `O documento ${doc.id} foi criado com sucesso!` });
        })
        .catch((err) => {
            res.status(500).json({ error: 'Algo deu errado!' });
        });
});