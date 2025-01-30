const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const crypto = require('crypto');

let users = [{}];

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
}

const secretKey = generateSecretKey();

const isValid = (username) => {
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password)=>{ //returns boolean
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  if (!isValid(username, password)) {
    return res.status(400).json({ message: "Invalid username" });
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 20 });
      req.session.authorization = {
        accessToken, username

    }
    return res.status(200).send("Customer successfully logged in");
  } else {
    return res.status(208).send("Incorrect Login. Check credentials");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const user = req.session.authorization.username;
  const review = req.body.review;
  const isbn = req.params.isbn;

  if (!review) {
    res.json({ message: "The review is empty!" });
  } else {
    books[isbn].reviews[user] = review;
    res.json({ message: "The book review has been updated!" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const user = req.session.authorization.username;
  const isbn = req.params.isbn;
  if (!books[isbn]) {
    res.json({ message: "invalid ISBN." });
  } else if (!books[isbn].reviews[user]) {
    res.json({ message: `${user} hasn't submitted a review for this book.` });
  } else {
    delete books[isbn].reviews[user];
    res.json({ message: "Book review deleted." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
