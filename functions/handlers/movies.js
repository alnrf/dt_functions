const { db } = require('../util/admin');

exports.getAllMovies = (req, res) => {
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
}

exports.postNewMovie = (req, res) => {
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
};