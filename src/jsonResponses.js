const fs = require("fs");

const movies = fs.readFileSync("./resources/disney_movies.json");
let favoriteData = fs.readFileSync("./resources/favorites.json");

const moviesJSON = JSON.parse(movies);
let selectedMovies = [];

// select movies based on url
const selectMovies = (url) => {
  selectedMovies = [];
  let parameters = [];

  // if there are query parameters
  if (url.includes("?")) {
    parameters.push(url.split("?")[1]);
    // if there are multiple query parameters
    if (url.includes("&")) {
      parameters = parameters[0].split("&");
    }

    // loop through each parameter that exists
    parameters.forEach((indvParameter) => {
      // split to param name and value
      const parameter = indvParameter.split("=");
      const param = parameter[0];
      const info = String(parameter[1].replace(/%20/g, " "));

      // check each movie for matching params
      moviesJSON.forEach((movie) => {
        // if param is title
        if (param.includes("title")) {
          const { title } = movie;

          // add movies with title
          if (title.toLowerCase().includes(info.toLowerCase())) {
            if (
              !selectedMovies.find((addedMovie) => addedMovie.title === title)
            ) {
              selectedMovies.push(movie);
            }
          }
        }
        // if param is year
        if (param.includes("year")) {
          let releases = movie["Release date"];

          if (!Array.isArray(releases)) {
            releases = [releases];
          }

          // add movies with year
          releases.forEach((release) => {
            if (release && release.includes(info)) {
              if (
                !selectedMovies.find(
                  (addedMovie) => addedMovie.title === movie.title
                )
              ) {
                selectedMovies.push(movie);
              }
            }
          });
        }
        // if param is actor
        if (param.includes("actor")) {
          let actors = movie.Starring;

          if (!Array.isArray(actors)) {
            actors = [actors];
          }

          // add movies with actor
          actors.forEach((actor) => {
            if (actor && actor.toLowerCase().includes(info)) {
              if (
                !selectedMovies.find(
                  (addedMovie) => addedMovie.title === movie.title
                )
              ) {
                selectedMovies.push(movie);
              }
            }
          });
        }
        // if param is director
        if (param.includes("director")) {
          let directors = movie["Directed by"];

          if (!Array.isArray(directors)) {
            directors = [directors];
          }

          // add movies with director
          directors.forEach((director) => {
            if (director && director.toLowerCase().includes(info)) {
              if (
                !selectedMovies.find(
                  (addedMovie) => addedMovie.title === movie.title
                )
              ) {
                selectedMovies.push(movie);
              }
            }
          });
        }
        // if param is box office grossing
        if (param.includes("grossing")) {
          const grossing = movie["Box office (float)"];
          let gross;

          // check if gt or lt then add movies
          if (info.includes("%3E")) {
            gross = parseInt(info.split("%3E")[1], 10);

            if (grossing > gross) {
              if (
                !selectedMovies.find(
                  (addedMovie) => addedMovie.title === movie.title
                )
              ) {
                selectedMovies.push(movie);
              }
            }
          } else if (info.includes("%3C")) {
            gross = parseInt(info.split("%3C")[1], 10);

            if (grossing < gross) {
              if (
                !selectedMovies.find(
                  (addedMovie) => addedMovie.title === movie.title
                )
              ) {
                selectedMovies.push(movie);
              }
            }
          }
        }
        // if param is running time
        if (param.includes("duration")) {
          const duration = movie["Running time (int)"];
          let dur;

          // check gt or lt then add movies
          if (info.includes("%3E")) {
            dur = parseInt(info.split("%3E")[1], 10);

            if (duration > dur) {
              if (
                !selectedMovies.find(
                  (addedMovie) => addedMovie.title === movie.title
                )
              ) {
                selectedMovies.push(movie);
              }
            }
          } else if (info.includes("%3C")) {
            dur = parseInt(info.split("%3C")[1], 10);

            if (duration < dur) {
              if (
                !selectedMovies.find(
                  (addedMovie) => addedMovie.title === movie.title
                )
              ) {
                selectedMovies.push(movie);
              }
            }
          }
        }
        // if param is imdb rating
        if (param.includes("imdb")) {
          const imdb = movie.imdb_rating;

          // add movies with matching imdb
          if (imdb === info) {
            if (
              !selectedMovies.find(
                (addedMovie) => addedMovie.title === movie.title
              )
            ) {
              selectedMovies.push(movie);
            }
          }
        }
        // if param is rotten tomatoes rating
        if (param.includes("tomatoes")) {
          const tomatoes = movie.rotten_tomatoes;

          // add movies with matching tomatoes
          if (tomatoes && tomatoes.includes(info)) {
            if (
              !selectedMovies.find(
                (addedMovie) => addedMovie.title === movie.title
              )
            ) {
              selectedMovies.push(movie);
            }
          }
        }
      });
    });
  }
  // if no query params add all movies
  else {
    selectedMovies = moviesJSON;
  }
};

// get movies based on given data
const getAllMovies = (request, response) => {
  selectMovies(request.url);

  const responseData = {
    message: selectedMovies,
  };

  const responseMessage = JSON.stringify(responseData);

  response.writeHead(200, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(responseMessage, "utf-8"),
  });
  if (request.method !== "HEAD") {
    response.write(responseMessage);
  }
  response.end();
};

// get movie titles based on given data
const getMovieTitles = (request, response) => {
  selectMovies(request.url);

  const keys = Object.keys(selectedMovies);
  let titles = "";
  keys.forEach((key) => {
    titles += `${selectedMovies[key].title}, `;
  });

  const responseData = {
    message: titles,
  };

  const responseMessage = JSON.stringify(responseData);

  response.writeHead(200, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(responseMessage, "utf-8"),
  });
  if (request.method !== "HEAD") {
    response.write(responseMessage);
  }
  response.end();
};

// get movie based on given rating
const getMovieByRating = (request, response) => {
  selectMovies(request.url);

  const responseData = {
    message: selectedMovies,
  };

  const responseMessage = JSON.stringify(responseData);

  response.writeHead(200, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(responseMessage, "utf-8"),
  });
  if (request.method !== "HEAD") {
    response.write(responseMessage);
  }
  response.end();
};

// get movie based on given details
const getMovieByDetails = (request, response) => {
  selectMovies(request.url);

  const responseData = {
    message: selectedMovies,
  };

  const responseMessage = JSON.stringify(responseData);

  response.writeHead(200, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(responseMessage, "utf-8"),
  });
  if (request.method !== "HEAD") {
    response.write(responseMessage);
  }
  response.end();
};

// get favorite movies from favorites.json
const getFavoriteMovies = (request, response) => {
  favoriteData = fs.readFileSync("./resources/favorites.json");

  const responseData = {
    message: JSON.parse(favoriteData),
  };

  const responseMessage = JSON.stringify(responseData);

  response.writeHead(200, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(responseMessage, "utf-8"),
  });
  if (request.method !== "HEAD") {
    response.write(responseMessage);
  }
  response.end();
};

// add a favorite movie to favorites.json
const addFavoriteMovie = (request, response) => {
  let bodyData = "";
  let selectedFavorite;

  let responseData;
  let status;

  // collect post body
  request.on("data", (chunk) => {
    bodyData += chunk;
  });

  request.on("end", () => {
    const data = JSON.parse(bodyData);
    const movTitle = data.title.toLowerCase();
    favoriteData = JSON.parse(fs.readFileSync("./resources/favorites.json"));

    // find movie with given title
    selectedFavorite = moviesJSON.find((movie) =>
      movie.title.toLowerCase().includes(movTitle)
    );

    if (selectedFavorite !== undefined) {
      // add movie to array, then push array to favorites.json
      favoriteData.push(selectedFavorite);
      fs.writeFileSync(
        "../project1-json-api/resources/favorites.json",
        JSON.stringify(favoriteData)
      );
      responseData = {
        message: "Created Successfully",
      };
      status = 201;
    } else {
      responseData = {
        id: "noMatchingTitle",
        message: "Provided title does not match an existing movie.",
      };
      status = 400;
    }

    const responseMessage = JSON.stringify(responseData);
    response.writeHead(status, {
      "Content-Type": "application/json",
    });
    response.write(responseMessage);
    response.end();
  });
};

// add a personal rating to a movie
const addMovieRating = (request, response) => {
  let bodyData = "";
  let selectedMovie;

  let responseData;
  let status;

  // collect post body
  request.on("data", (chunk) => {
    console.log("data");
    bodyData += chunk;
  });

  request.on("end", () => {
    const data = JSON.parse(bodyData);
    const movTitle = data.title.toLowerCase();

    // see if a movie has the requested title
    selectedMovie = moviesJSON.find((movie) =>
      movie.title.toLowerCase().includes(movTitle)
    );

    // get rating
    const rating = parseFloat(data.rating);

    // if rating and title exist
    if (selectedMovie && rating) {
      // assign rating field to movie
      // Assisted by ChatGPT after encountering a no-param-reassign error
      const movieIndex = moviesJSON.findIndex(
        (movie) => movie.title === selectedMovie.title
      );
      if (movieIndex !== -1) {
        moviesJSON[movieIndex] = {
          ...moviesJSON[movieIndex],
          PersonalRating: data.rating,
        };
      }

      status = 204;
    }
    // if one or both don't
    else {
      // if there isn't a rating
      if (!rating) {
        responseData = {
          id: "invalidRating",
          message: "The rating you provided is not a valid number",
        };
      }
      // if there isn't a title
      else {
        responseData = {
          id: "noMatchingTitle",
          message: "Provided title does not match an existing movie.",
        };
      }
      status = 400;
    }

    const responseMessage = JSON.stringify(responseData);
    response.writeHead(status, {
      "Content-Type": "application/json",
    });
    if (status !== 204) {
      response.write(responseMessage);
    }
    response.end();
  });
};

// return page not found
const getNotFound = (request, response) => {
  const responseData = {
    id: "notFound",
    message: "The page you are looking for was not found",
  };

  const responseMessage = JSON.stringify(responseData);
  response.writeHead(404, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(responseMessage, "utf-8"),
  });
  if (request.method !== "HEAD") {
    response.write(responseMessage);
  }
  response.end();
};

module.exports = {
  getAllMovies,
  getMovieTitles,
  getMovieByRating,
  getMovieByDetails,
  getFavoriteMovies,
  addFavoriteMovie,
  addMovieRating,
  getNotFound,
};
