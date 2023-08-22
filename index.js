const express = require('express'),
    morgan = require('morgan');

const app = express();

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

mongoose.connect('mongodb://localhost:27017/cfDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let myLogger = (req, res, next) => {
  console.log(req.url);
  next();
};

let requestTime = (req, res, next) => {
  req.requestTime = Date.now();
  next();
};

app.use(myLogger);
app.use(requestTime);
app.use(morgan('common'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Uh oh, something went wrong!');
});

app.get('/', (req, res) => {
  let responseText = 'Welcome to myFlix!';
  responseText += '<small>Requested at: ' + req.requestTime + '</small>';
  res.send(responseText);
});

app.get('/secreturl', (req, res) => {
  let responseText = 'This is a secret url with super top-secret content.';
  responseText += '<small>Requested at: ' + req.requestTime + '</small>';
  res.send(responseText);
});

// Get full list of movies
app.get('/movies', async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get data about a single movie by title
app.get('/movies/:title', async (req, res) => {
  await Movies.findOne({ Title: req.params.title })
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Get data about all genres
app.get('/genres', async (req, res) => {
  await Genres.find()
    .then((genres) => {
      res.status(201).json(genres);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get data about a genre by name
app.get('/genres/:name', async (req, res) => {
  await Genres.findOne({ name: req.params.name })
  .then((name) => {
    res.json(name);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Get data about all directors
app.get('/directors', async (req, res) => {
  await Directors.find()
    .then((directors) => {
      res.status(201).json(directors);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get data about a director by name
app.get('/directors/:name', async (req, res) => {
  await Directors.findOne({ name: req.params.name })
  .then((name) => {
    res.json(name);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Register a new user
app.post('/users', async (req, res) => {
  await Users.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + ' already exists');
      } else {
        Users
          .create({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            birthday: req.body.birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Get all users
app.get('/users', async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:username', async (req, res) => {
  await Users.findOne({ username: req.params.username })
  .then((user) => {
    res.json(user);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Update a user's info
app.put('/users/:username', async (req, res) => {
  await Users.findOneAndUpdate({ username: req.params.username},
    { $set:
      {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        birthday: req.body.birthday
      }
    },
    { new: true}) // Makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

// Add a movie to user's list of favorite movies
app.post('/users/:username/favorites/:movieID', async (req, res) => {
  await Users.findOneAndUpdate({ username: req.params.username }, {
    $push: {favoriteMovies: req.params.movieID }
  },
  { new: true}) // Makes sure that the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Remove a movie to user's list of favorite movies
app.delete('/users/:username/favorites/:movieID', async (req, res) => {
  await Users.findOneAndUpdate({ username: req.params.username }, {
    $pull: {favoriteMovies: req.params.movieID }
  },
  { new: true}) // Makes sure that the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Remove an existing user from the resgistry
app.delete('/users/:username', async (req, res) => {
  await Users.findOneAndRemove({ username: req.params.username })
    .then ((user) => {
      if (!user) {
        res.status(400).send(req.params.username + ' was not found.');
      } else {
        res.status(200).send(req.params.username + ' was deleted.')
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});