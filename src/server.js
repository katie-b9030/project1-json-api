const http = require("http");
const htmlHandler = require("./htmlResponses.js");
const jsonHandler = require("./jsonResponses.js");

// "dynamically" assign port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
  console.log(request.url);

  // call proper request based on url start
  if (request.url.startsWith("/allMovies")) {
    jsonHandler.getAllMovies(request, response);
  } else if (request.url.startsWith("/movieTitles")) {
    jsonHandler.getMovieTitles(request, response);
  } else if (request.url.startsWith("/movieByDetails")) {
    jsonHandler.getMovieByDetails(request, response);
  } else if (request.url.startsWith("/movieByRating")) {
    jsonHandler.getMovieByRating(request, response);
  } else if (request.url.startsWith("/favoriteMovies")) {
    jsonHandler.getFavoriteMovies(request, response);
  } else if (request.url === "/addFavorite") {
    jsonHandler.addFavoriteMovie(request, response);
  } else if (request.url === "/addRating") {
    jsonHandler.addMovieRating(request, response);
  }
  // get html responses
  else if (request.url === "/style.css") {
    htmlHandler.getCSS(request, response);
  } else if (request.url === "/") {
    htmlHandler.getIndex(request, response);
  } else {
    jsonHandler.getNotFound(request, response);
  }
};

// start server
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
