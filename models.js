const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    genre: {
      genreID: String
    },
    director: {
      directorID: String
    },
    actors: [String],
    imagePath: String,
    featured: Boolean
  });
  
  let userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    birthday: Date,
    favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
  });

  userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
  };

  userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  
  let directorSchema = mongoose.Schema({
    name: String,
    bio: String,
    birth: Date,
    death: Date
  });

  let genreSchema = mongoose.Schema({
    name: String,
    description: String
  });

  let Movie = mongoose.model('Movie', movieSchema);
  let User = mongoose.model('User', userSchema);
  let Director = mongoose.model('Director', directorSchema);
  let Genre = mongoose.model('Genre', genreSchema);
  
  module.exports.Movie = Movie;
  module.exports.User = User;
  module.exports.Director = Director;
  module.exports.Genre = Genre;