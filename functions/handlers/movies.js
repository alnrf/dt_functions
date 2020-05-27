const { db } = require('../util/admin');


// Recupera todas as mídias
exports.getAllMovies = (req, res) => {
  db.collection('media')
    .orderBy('title_pt', 'asc')
    .get()
    .then((data) => {
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
          date: doc.data().date,
        });
      });
      return res.json(movies);
    })
    .catch((err) => console.log(err));
};

// Posta uma nova mídia
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
    userHandle: req.user.handle,
  };

  db.collection('media')
    .add(newMovie)
    .then((doc) => {
      res.json({
        message: `O documento ${doc.id} foi criado com sucesso!`,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: 'Algo deu errado!',
      });
      console.log(err);
    });
};

// Recupera uma única midia e seus comentários
exports.getMovie = (req, res) => {
  let movieData = {};
  db.doc(`/media/${req.params.movieId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({
          error: 'Filme não encontrado!',
        });
      }
      movieData = doc.data();
      movieData.movieId = doc.id;
      return db
        .collection('comments')
        .orderBy('createdAt','desc')
        .where('movieId', '==', req.params.movieId)
        .get();
    })
    .then((data) => {
      movieData.comments = [];
      data.forEach((doc) => {
        movieData.comments.push(doc.data());
      });
      return res.json(movieData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

//Cria novo comentário
exports.postNewComent = (req, res) => {
  if(req.body.body.trim() === '') return res.status(400).json({ error: 'Não pode ser vazio!'});

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    movieId: req.params.movieId,
    userHandle: req.user.handle,
    imageUrl: req.user.imageUrl
  };

  db.doc(`/media/${req.params.movieId}`).get()
    .then(doc => {
      if(!doc.exists){
        return res.status(404).json({ error: 'Mídia não encontrada!'});
      }
      return db.collection('comments').add(newComment);
    })
    .then(() => {
      res.json(newComment);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Algo saiu errado!'});
    });
};

/* exports.deleteMovie = (req, res) => {
    const document = db.doc(`/media/${req.params.movieId}`);
    document
        .get()
        .then(doc => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'Filme não encontrado!'});
            } else {
                return document.delete();
            }
        })
        .then(() => {
           res.json({ message: 'Filme deletado com sucesso!'});
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
}; */
