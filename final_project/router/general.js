const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getAllBooks = () => {
  return books;
};

public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const allBooks = getAllBooks();
  res.send(JSON.stringify(allBooks,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  const targetBook = books[ISBN];
  res.send(JSON.stringify(targetBook,null,4)); 
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const matchingBooks = Object.values(books).filter(
    (book) => book.author.toLowerCase() === req.params.author.toLowerCase()
  );
  res.send(JSON.stringify(matchingBooks,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const matchingTitle = Object.values(books).filter(
    (book) => book.title.toLowerCase() === req.params.title.toLowerCase()
  );
  res.send(JSON.stringify(matchingTitle,null,4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  const targetBook = books[ISBN];
  res.send(JSON.stringify(targetBook.reviews,null,4))
});

module.exports.general = public_users;
