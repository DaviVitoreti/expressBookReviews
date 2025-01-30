const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  return users.some((user) => user.username === username);
};

const getAllBooks = () => {
  return books;
};

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.json({ message: "Missing username or password" });
  } else if (doesExist(username)) {
    return res.json({ message: "user already exists." });
  } else {
    users.push({ username: username, password: password });
    return res.json({ message: "User successfully registered.  Please login." });
  }
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    const allBooks = await getAllBooks();
    res.send(JSON.stringify(allBooks,null,4));
  } catch (e) {
    res.send(e);
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const ISBN = req.params.isbn;
  const targetBook = await books[ISBN];
  res.send(JSON.stringify(targetBook,null,4)); 
 });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const matchingBooks = Object.values(await books).filter(
    (book) => book.author.toLowerCase() === req.params.author.toLowerCase()
  );
  res.send(JSON.stringify(matchingBooks,null,4));
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  const matchingTitle = Object.values(await books).filter(
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
