const fs = require("fs");

const movies = fs.readFileSync("./resources/disney_movies.json");
let favoriteData = fs.readFileSync("./resources/favorites.json");

const moviesJSON = JSON.parse(movies);
let selectedMovies = [];

const selectMovies = (url) => {
  selectedMovies = [];
  let parameters = [];

  if (url.includes("?")) {
    parameters.push(url.split("?")[1]);
    if (url.includes("&")) {
      parameters = parameters[0].split("&");
    }
    console.log(parameters);
    parameters.forEach((indvParameter) => {
      const parameter = indvParameter.split("=");

      const param = parameter[0];
      const info = String(parameter[1].replace(/%20/g, " "));
      moviesJSON.forEach((movie) => {
        if (param.includes("title")) {
          const { title } = movie;

          if (title.toLowerCase().includes(info.toLowerCase())) {
            if (
              !selectedMovies.find((addedMovie) => addedMovie.title === title)
            ) {
              selectedMovies.push(movie);
            }
          }
        }
        if (param.includes("year")) {
          let releases = movie["Release date"];

          if (!Array.isArray(releases)) {
            releases = [releases];
          }

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
        if (param.includes("actor")) {
          let actors = movie.Starring;

          if (!Array.isArray(actors)) {
            actors = [actors];
          }

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
        if (param.includes("director")) {
          let directors = movie["Directed by"];

          if (!Array.isArray(directors)) {
            directors = [directors];
          }

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
        if (param.includes("grossing")) {
          const grossing = movie["Box office (float)"];
          let gross;

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
        if (param.includes("duration")) {
          const duration = movie["Running time (int)"];
          let dur;

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
        if (param.includes("imdb")) {
          const imdb = movie.imdb_rating;

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
        if (param.includes("tomatoes")) {
          const tomatoes = movie.rotten_tomatoes;

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
  } else {
    selectedMovies = moviesJSON;
  }
};

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

const addFavoriteMovie = (request, response) => {
  let bodyData = "";
  let selectedFavorite;

  let responseData;
  let status;

  request.on("data", (chunk) => {
    bodyData += chunk;
  });

  request.on("end", () => {
    const data = JSON.parse(bodyData);
    const movTitle = data.title.toLowerCase();
    favoriteData = JSON.parse(fs.readFileSync("./resources/favorites.json"));

    selectedFavorite = moviesJSON.find((movie) =>
      movie.title.toLowerCase().includes(movTitle)
    );

    if (selectedFavorite !== undefined) {
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

const addMovieRating = (request, response) => {
  let bodyData = "";
  let selectedMovie;

  let responseData;
  let status;

  request.on("data", (chunk) => {
    console.log("data");
    bodyData += chunk;
  });

  request.on("end", () => {
    const data = JSON.parse(bodyData);
    const movTitle = data.title.toLowerCase();

    selectedMovie = moviesJSON.find((movie) =>
      movie.title.toLowerCase().includes(movTitle)
    );

    const rating = parseFloat(data.rating);

    if (selectedMovie && rating) {
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
    } else {
      if (!rating) {
        responseData = {
          id: "invalidRating",
          message: "The rating you provided is not a valid number",
        };
      } else {
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
