const fs = require('fs');

const movies = fs.readFileSync('./resources/disney_movies.json');
const favoriteData = fs.readFileSync('./resources/favorites.json');

const moviesJSON = JSON.parse(movies);
let selectedMovies = {};

const selectMovies = (url) => {
  selectedMovies = {};

  const keys = Object.keys(moviesJSON);
  keys.forEach((key) => {
    const movie = moviesJSON[key];
    if (url.includes('?')) {
      const parameter = url.split('?')[1];
      let info = parameter.split('=')[1];
      info.replace(/%20/g, ' ');
      info.replace(/\+/g, ' ');

      if (parameter.includes('title')) {
        const { title } = movie;

        if (info.toLowerCase().includes(title.toLowerCase())) {
          selectedMovies[movie.title] = movie;
        }
      } else if (parameter.includes('year')) {
        let releases = movie['Release date'];

        if (typeof releases === 'string') {
          releases = [releases];
        }
        releases.map((release) => release.split(', ')[1]);

        releases.forEach((release) => {
          if (release.year === info) {
            selectedMovies[movie.title] = movie;
          }
        });
      } else if (parameter.includes('actor')) {
        let actors = movie.Starring;

        if (typeof actors === 'string') {
          actors = [actors];
        }

        actors.forEach((actor) => {
          if (actor.toLowerCase() === info) {
            selectedMovies[movie.title] = movie;
          }
        });
      } else if (parameter.includes('director')) {
        let directors = movie['Directed by'];

        if (typeof directors === 'string') {
          directors = [directors];
        }

        directors.forEach((director) => {
          if (director.toLowerCase() === info) {
            selectedMovies[movie.title] = movie;
          }
        });
      } else if (parameter.includes('grossing')) {
        const grossing = movie['Box office (float)'];

        if (info.includes('>')) {
          info = parseInt(info.split('>')[1], 10);

          if (grossing > info) {
            selectedMovies[movie.title] = movie;
          }
        } else if (info.includes('<')) {
          info = parseInt(info.split('<')[1], 10);

          if (grossing < info) {
            selectedMovies[movie.title] = movie;
          }
        }
      } else if (parameter.includes('duration')) {
        const duration = movie['Running time (int)'];

        if (info.includes('>')) {
          info = parseInt(info.split('>')[1], 10);

          if (duration > info) {
            selectedMovies[movie.title] = movie;
          }
        } else if (info.includes('<')) {
          info = parseInt(info.split('<')[1], 10);

          if (duration < info) {
            selectedMovies[movie.title] = movie;
          }
        }
      } else if (parameter.includes('imdb')) {
        const imdb = movie.imdb_rating;

        if (imdb === info) {
          selectedMovies[movie.title] = movie;
        }
      } else if (parameter.includes('tomatoes')) {
        const tomatoes = movie.rotten_tomatoes;

        if (tomatoes === info) {
          selectedMovies[movie.title] = movie;
        }
      }
    } else {
      selectedMovies = moviesJSON;
    }
  });
};

const getAllMovies = (request, response) => {
  selectMovies(request.url);

  const responseData = {
    message: selectedMovies,
  };

  const responseMessage = JSON.stringify(responseData);

  response.writeHead(200, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(responseMessage, 'utf-8'),
  });
  if (request.method !== 'HEAD') {
    response.write(responseMessage);
  }
  response.end();
};

const getMovieTitles = (request, response) => {
  selectMovies(request.url);

  const keys = Object.keys(selectedMovies);
  let titles = '';
  keys.forEach((key) => {
    titles += `${selectedMovies[key].title}, `;
  });

  const responseData = {
    message: titles,
  };

  const responseMessage = JSON.stringify(responseData);

  response.writeHead(200, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(responseMessage, 'utf-8'),
  });
  if (request.method !== 'HEAD') {
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
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(responseMessage, 'utf-8'),
  });
  if (request.method !== 'HEAD') {
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
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(responseMessage, 'utf-8'),
  });
  if (request.method !== 'HEAD') {
    response.write(responseMessage);
  }
  response.end();
};

const getFavoriteMovies = (request, response) => {
  const favoriteMovies = favoriteData.movies;

  const responseData = {
    message: favoriteMovies,
  };

  const responseMessage = JSON.stringify(responseData);

  response.writeHead(200, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(responseMessage, 'utf-8'),
  });
  if (request.method !== 'HEAD') {
    response.write(responseMessage);
  }
  response.end();
};

const addFavoriteMovie = (request, response) => {
  let bodyData = '';
  let selectedFavorite;

  let responseData;
  let status;

  request.on('data', (chunk) => {
    bodyData += chunk;
  });

  request.on('end', () => {
    const keys = Object.keys(moviesJSON);
    keys.forEach((key) => {
      const movie = moviesJSON[key];
      if (bodyData.toLowerCase() === movie.title) {
        selectedFavorite = movie;
        responseData = {
          message: 'Created Successfully',
        };
        status = 201;
      } else {
        responseData = {
          id: 'noMatchingTitle',
          message: 'Provided title does not match an existing movie.',
        };
        status = 400;
      }
    });

    fs.writeFileSync('favorites.json', JSON.stringify(selectedFavorite));

    const responseMessage = JSON.stringify(responseData);
    response.writeHead(status, {
      'Content-Type': 'application/json',
    });
    if (status !== 204) {
      response.write(responseMessage);
    }
    response.end();
  });
};

const addMovieRating = (request, response) => {
  let bodyData = '';

  request.on('data', (chunk) => {
    bodyData += chunk;
  });

  request.on('end', () => {
    const keys = Object.keys(moviesJSON);
    const data = JSON.parse(bodyData);

    let status;
    let responseData;

    keys.forEach((key) => {
      const movie = moviesJSON[key];
      if (data.title.toLowerCase() === movie.title) {
        movie['Personal Rating'] = data.rating;
        status = 204;
      } else {
        responseData = {
          id: 'noMatchingTitle',
          message: 'Provided title does not match an existing movie.',
        };
        status = 400;
      }
    });

    const responseMessage = JSON.stringify(responseData);
    response.writeHead(status, {
      'Content-Type': 'application/json',
    });
    if (status !== 204) {
      response.write(responseMessage);
    }
    response.end();
  });
};

const getNotFound = (request, response) => {
  const responseData = {
    id: 'notFound',
    message: 'The page you are looking for was not found',
  };

  const responseMessage = JSON.stringify(responseData);
  response.writeHead(404, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(responseMessage, 'utf-8'),
  });
  if (request.method !== 'HEAD') {
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
