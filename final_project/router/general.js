const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
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
public_users.get('/', async (req, res) => {
    try {
        // Simulate fetching books via axios (could be an API endpoint)
        // Here, since books are local, we use a resolved Promise to simulate async
        const response = await Promise.resolve({ data: books });

        res.send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

/// Get book details based on ISBN using async/await + axios
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn; // Get ISBN from request parameters

    try {
        // Simulate fetching the book asynchronously
        const response = await Promise.resolve({ data: books[isbn] });

        if (response.data) {
            res.send(JSON.stringify(response.data, null, 4));
        } else {
            res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching book by ISBN", error: error.message });
    }
});

  
// Get book details based on author using async/await + axios
public_users.get('/author/:author', async (req, res) => {
    const authorName = req.params.author; // Get author from request params

    try {
        // Simulate async fetching of all books
        const response = await Promise.resolve({ data: Object.values(books) });

        // Filter books by author
        const matchingBooks = response.data.filter(book => book.author === authorName);

        if (matchingBooks.length > 0) {
            res.send(JSON.stringify(matchingBooks, null, 4));
        } else {
            res.status(404).json({ message: `No books found by author ${authorName}` });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by author", error: error.message });
    }
});


// Get book details based on title using async/await + axios
public_users.get('/title/:title', async (req, res) => {
    const titleName = req.params.title; // Get title from request params

    try {
        // Simulate async fetching of all books
        const response = await Promise.resolve({ data: Object.values(books) });

        // Filter books by title
        const matchingBooks = response.data.filter(book => book.title === titleName);

        if (matchingBooks.length > 0) {
            res.send(JSON.stringify(matchingBooks, null, 4));
        } else {
            res.status(404).json({ message: `No books found with title "${titleName}"` });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by title", error: error.message });
    }
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
