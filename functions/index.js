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

const FBAuth = (req, res, next) => {
    let idToken;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        console.error('Token não encontrado!')
        return res.status(403).json({ error: 'Não autorizado!'});
    }

    admin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            req.user = decodedToken;
            console.log(decodedToken);
            return db.collection('users')
                .where('userId', '==', req.user.uid)
                .limit(1)
                .get();
        })
        .then(data => {
            req.user.handle = data.docs[0].data().handle;
            return next();
        })
        .catch(err => {
            console.error('Erro ao verificar o token ', err);
            return res.status(403).json(err);
        })
}

app.post('/newMovie', FBAuth, (req, res) => {
    const newMovie = {
        category: req.body.category,
        cover: req.body.cover,
        date: new Date().toISOString(),
        media_type: req.body.media_type,
        package: req.body.package,
        season: req.body.season,
        title_eng: req.body.title_eng,
        title_pt: req.body.title_pt,
        year: req.body.year,
        userHandle: req.user.handle
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

const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regEx)) return true;
    else return false;
}

const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false;
}

//Rota de Sign-up
app.post('/signup', (req,res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };

    let errors = {};

    if(isEmpty(newUser.email)) {
        errors.email = 'Email não pode ser vazio'
    } else if(!isEmail(newUser.email)) {
        errors.email = 'Deve ser um email válido'
    }

    if(isEmpty(newUser.password)) errors.password = 'Senha não pode ser vazia'
    if(newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Senhas não são iguais'
    if(isEmpty(newUser.handle)) errors.handle = 'Não pode ser vazio'

    if(Object.keys(errors).length > 0) return res.status(400).json(errors);

    //Validation
    let token, userId;
    db.doc(`/users/${newUser.handle}`)
    .get()
    .then(doc => {
        if(doc.exists){
            return res.status(400).json({ handle: 'Este handle já foi usado'});
        } else {
            return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
        }
    })
    .then((data) => {
        userId = data.user.uid;
        return data.user.getIdToken();
    })
    .then((idToken) => {
        token = idToken;
        const userCredentials = {
            handle: newUser.handle,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            userId
        };
        return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
        return res.status(201).json({ token });
    })
    .catch((err) => {
        console.error(err);
        if (err.code === 'auth/email-already-in-use') {
            return res.status(400).json({ email: 'Email já em uso'});
        } else {
            return res.status(500).json({err: err.code});   
        }
    });      
});


//Login Route

app.post('/login', (req,res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    let errors = {};

    if(isEmpty(user.email)) errors.email = 'Não pode ser vazio';
    if(isEmpty(user.password)) errors.password = 'Não pode ser vazio';

    if(Object.keys(errors).length > 0) return res.status(400).json(errors);

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token => {
            return res.json({ token });
        })
        .catch(err => {
            console.error(err);
            if(err.code === 'auth/wrong-password'){
                return res.status(403).json({ password: 'Senha incorreta, tente novamente'});
            } else if(err.code === 'auth/user-not-found'){
                return res.status(403).json({ email: 'Email incorreto, tente novamente'});
            }
            return res.status(500).json({ error: err.code });
        });
});

exports.api = functions.https.onRequest(app);