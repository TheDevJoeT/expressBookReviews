const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if user exists and credentials match
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: "Invalid login. Check username and password" });
    }

    // Generate JWT access token
    const accessToken = jwt.sign(
        { username: username },  // store username in token payload
        "access",               // secret key
        { expiresIn: 60 * 60 }  // token expires in 1 hour
    );

    // Save token in session (will be used for authenticated routes)
    req.session.authorization = {
        accessToken,
        username
    };

    return res.status(200).json({ message: "User successfully logged in", accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;                   // Get ISBN from URL
    const review = req.query.review;                // Get review from query parameter
    const username = req.session.authorization?.username; // Get username from session

    if (!username) {
        return res.status(403).json({ message: "User not logged in" });
    }

    if (!review) {
        return res.status(400).json({ message: "Review content is required" });
    }

    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }

    // If 'reviews' object doesn't exist, initialize it
    if (!book.reviews) {
        book.reviews = {};
    }

    // Add or update the review
    book.reviews[username] = review;

    return res.status(200).json({
        message: `Review for ISBN ${isbn} added/updated successfully`,
        reviews: book.reviews
    });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;                   // Get ISBN from URL
    const username = req.session.authorization?.username; // Get username from session

    if (!username) {
        return res.status(403).json({ message: "User not logged in" });
    }

    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }

    if (!book.reviews || !book.reviews[username]) {
        return res.status(404).json({ message: "You have not posted a review for this book" });
    }

    // Delete the review of the logged-in user
    delete book.reviews[username];

    return res.status(200).json({
        message: `Your review for ISBN ${isbn} has been deleted`,
        reviews: book.reviews
    });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
