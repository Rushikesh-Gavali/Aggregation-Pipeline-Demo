const mongoose = require('mongoose');

// Schema for Authors collection
const authorSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  birth_year: Number
});

// Schema for Books collection
const bookSchema = new mongoose.Schema({
  _id: Number,
  title: String,
  author_id: Number,
  genre: String
});

// Schema for Users collection
const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  index: Number,
  name: String,
  isActive: Boolean,
  registered: Date,
  age: Number,
  gender: String,
  eyeColor: String,
  favoriteFruit: String,
  company: {
    title: String,
    email: String,
    phone: String,
    location: {
      country: String,
      address: String
    }
  },
  tags: [String]
});



const Author = mongoose.model('Author', authorSchema);
const Book = mongoose.model('Book', bookSchema);
const User = mongoose.model('User', userSchema);

module.exports = { Author, Book, User };
