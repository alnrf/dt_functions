let db = {
  newmovie: [
    {
      category: "Filme",
      cover:
        "https://66.media.tumblr.com/4d9acb4a210570e7f0fea77b99ee2b90/tumblr_mx55mwUJVG1r50qq4o1_500.gifv",
      media_type: "Blu-Ray",
      package: "Caixa",
      season: "",
      title_eng: "The Hunger Games: Catching Fire",
      title_pt: "Jogos Vorazes: Em Chamas",
      year: "2013",
    },
  ],

  comments: [
    {
      body: "comentário",
    },
  ],

  login: [
    {
      "email": "clubeandroid@gmail.com",
      "password": "123456",
    },
  ],

  signup: [
      {
        "email": "clubeandroid@gmail.com",
        "password": "123456",
        "confirmPassword": "123456",
        "handle": "user",
      }
  ]
};

let urls = {
  API: "comment",
  type: "post",
  url:
    "https://us-central1-biblioteca-207ae.cloudfunctions.net/api/movie/ykvxC616USdw5ilgZSxr/comment",

  API: "newMovie",
  type: "post",
  url: "https://us-central1-biblioteca-207ae.cloudfunctions.net/api/newMovie",
  Headers: "Authorization","Bearer token",

  API: "getAllMovies",
  type: "get",
  url:
    "https://us-central1-biblioteca-207ae.cloudfunctions.net/api/getAllMovies",

  API: "getMovie",
  type: "get",
  url:
    "https://us-central1-biblioteca-207ae.cloudfunctions.net/api/getMovie/MgyBdsFs5lFH53Z4N0L8",

  API: "login",
  type: "post",
  url: "https://us-central1-biblioteca-207ae.cloudfunctions.net/api/login",

  API: "SignUp",
  type: "post",
  url: "https://us-central1-biblioteca-207ae.cloudfunctions.net/api/signup",

  API: "like",
  type: "get",
  url: "https://us-central1-biblioteca-207ae.cloudfunctions.net/api/movie/:movieId/like'",

  API: "unlike",
  type: "get",
  url: "https://us-central1-biblioteca-207ae.cloudfunctions.net/api/movie/:movieId/unlike'",
};
