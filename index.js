const express = require('express'),
    morgan = require('morgan');

const app = express();

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
app.get('/movies', (req, res) => {
    let movObj = {"mov1":"The Matrix",
        "mov2":"The Shawshank Redemption",
        "mov3":"Top Gun: Maverick"
    };
    res.send(movObj).send('Here\s the full list of movies');
});

// Get data about a single movie by title
app.get('/movies/:title', (req, res) => {
  res.send('Here\'s some info about ' + req.params.title);
});

// Get data about a genre by name
app.get('/genres/:name', (req, res) => {
  res.send('Here\'s some info about the ' + req.params.name + ' genre.')
});

// Get data about a director by name
app.get('/directors/:name', (req, res) => {
  res.send('Here\'s some info about ' + req.params.name);
});

// Register a new user
app.post('/users', (req, res) => {
  res.send('New user registered!');
});

// Update a user's info
app.put('/users/:name', (req, res) => {
  res.send('Updated user ' + req.params.name + '\'s info.');
});

// Add a movie to user's list of favorite movies
app.post('/users/:name/favorites/:title', (req, res) => {
  res.send('Added movie ' + req.params.title + ' to user ' + 
  req.params.name + '\'s favorite movies.');
});

// Remove a movie to user's list of favorite movies
app.delete('/users/:name/favorites/:title', (req, res) => {
  res.send('Removed movie ' + req.params.title + ' from user ' + 
  req.params.name + '\'s favorite movies.');
});

// Remove an existing user from the resgistry
app.delete('/users/:name', (req, res) => {
  res.send('Removed user ' + req.params.name + ' from registry.');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});