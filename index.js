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

app.get('/movies', (req, res) => {
    let movObj = {"mov1":"The Matrix",
        "mov2":"The Shawshank Redemption",
        "mov3":"Top Gun: Maverick"
    };
    res.send(movObj);
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});