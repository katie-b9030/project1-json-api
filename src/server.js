const http = require("http");
const htmlHandler = require("./htmlResponses.js");
const jsonHandler = require("./jsonResponses.js");

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
  console.log(request.url);

  if (request.url === "/") {
    htmlHandler.getIndex(request, response);
  } else if (request.url === "/style.css") {
    htmlHandler.getCSS(request, response);
  } else if (request.url === "/allMovies") {
    jsonHandler.getAllMovies(request, response);
  } else if (request.url === "/movieTitles") {
    jsonHandler.getMovieTitles(request, response);
  } else if (request.url === "/movieByDetails") {
    jsonHandler.getMovieByDetails(request, response);
  } else if (request.url === "/movieByRating") {
    jsonHandler.getMovieByRating(request, response);
  } else if (request.url === "/favoriteMovies") {
    jsonHandler.getFavoriteMovies(request, response);
  } else if (request.url === "/addFavorite") {
    jsonHandler.addFavoriteMovie(request, response);
  } else if (request.url === "/addRating") {
    jsonHandler.addMovieRating(request, response);
  } else {
    jsonHandler.getNotFound(request, response);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
