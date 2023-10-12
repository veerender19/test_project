const express = require("express");
const Router = express.Router();
const bookController = require("../controllers/bookController");
const passport = require("passport");
require('dotenv').config();

Router.post(
    "/books", 
    passport.authenticate("jwt", { session: false }),
    bookController.bookAdd
);

Router.get(
    "/books", 
    passport.authenticate("jwt", { session: false }),
    bookController.bookList
);

Router.get(
    "/books/:id", 
    passport.authenticate("jwt", { session: false }),
    bookController.bookDetail
);

Router.post(
    "/borrow/:bookId/:userId", 
    passport.authenticate("jwt", { session: false }),
    bookController.borrowBook
);

Router.post(
    "/return/:bookId/:userId", 
    passport.authenticate("jwt", { session: false }),
    bookController.returnBook
);

Router.get(
    "/users/:userId/books", 
    passport.authenticate("jwt", { session: false }),
    bookController.userBorrowBookList
);

module.exports = Router;