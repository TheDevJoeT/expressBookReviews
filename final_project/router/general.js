const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username already exists
    const userExists = users.some(user => user.username === username);

    if (userExists) {
        return res.status(409).json({ message: "User already exists!" });
    }

    // Add the new user to the users array
    users.push({ username, password });
    return res.status(201).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4));
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn; // Retrieve ISBN from request parameters

    const book = books[isbn]; // Get the book from books database

    if (book) {
        res.send(JSON.stringify(book, null, 4)); // Send book details neatly
    } else {
        res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    };
 
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authorName = req.params.author; // Get author from request params
    const allBooks = Object.values(books); // Get all book objects
    const matchingBooks = allBooks.filter(book => book.author === authorName); // Filter by author

    if (matchingBooks.length > 0) {
        res.send(JSON.stringify(matchingBooks, null, 4)); // Return matched books
    } else {
        res.status(404).json({ message: `No books found by author ${authorName}` });
    }
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const titleName = req.params.title; // Get title from request params
    const allBooks = Object.values(books); // Get all book objects
    const matchingBooks = allBooks.filter(book => book.title === titleName); // Filter by title

    if (matchingBooks.length > 0) {
        res.send(JSON.stringify(matchingBooks, null, 4)); // Return matched books
    } else {
        res.status(404).json({ message: `No books found with title "${titleName}"` });
    };
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn; // Get ISBN from request parameters
    const book = books[isbn];     // Get the book from books database

    if (book) {
        res.send(JSON.stringify(book.reviews, null, 4)); // Send reviews only
    } else {
        res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
});

module.exports.general = public_users;
