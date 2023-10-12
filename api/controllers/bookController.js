const {sendResponse}= require("../../config/helper")
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const userModel = require("../models/Users")
const bookModel = require("../models/Books")
const userBookingModel = require("../models/UserBooking")
const {inputValidation} = require("../../validators/userValidator")
require('dotenv').config();
module.exports = {
    bookAdd: async (req, res) =>{
        try {
                // REQUEST VALIDATION
                const requestValidation = await inputValidation(req.body, "addBook");
                if (requestValidation) return sendResponse(requestValidation, res, 403,{});
            
                // verify isbn number
                let checkIsbnNumber = await bookModel.findOne({isbn:req.body.isbn})
                if (checkIsbnNumber) return sendResponse("isbn already exists ", res, 403,{});
                
                let saveBook = new bookModel(req.body)
                await saveBook.save()
           
                return sendResponse("Book added successfully", res, 200, {})
        } catch (error) {
            return sendResponse(error.message, res, 500, {})
        }
    },
    bookList: async (req, res) =>{
        try {            
                let bookList = await bookModel.find({quantity:{$gt:1}, status:1})                
                return sendResponse("Success", res, 200, {bookList})
        } catch (error) {
            return sendResponse(error.message, res, 500, {})
        }
    },
    bookDetail: async (req, res) =>{
        try {
            if(!req.params.id || req.params.id === undefined)
                return sendResponse("book id is required", res, 403, {}) 

            let book = await bookModel.findOne({_id:req.params.id, status:1})
            if(!book)         
            return sendResponse("book not found", res, 403, {}) 

            return sendResponse("Success", res, 200, {book:book})
        } catch (error) {
            return sendResponse(error.message, res, 500, {})
        }
    },
    borrowBook: async (req, res) =>{
        try {
            // REQUEST VALIDATION
            const requestValidation = await inputValidation(req.params, "borrowBook");
            if (requestValidation) return sendResponse(requestValidation, res, 403,{});

            let book = await bookModel.findOne({_id:req.params.bookId, status:1, quantity:{$gte:1}})
            if(!book)         
            return sendResponse("this book out of stock", res, 403, {})
           
            let isUserBookVerify = await userBookingModel.findOne({user:req.params.userId, book:req.params.bookId, status:1})
            if(isUserBookVerify)         
            return sendResponse("you can not borrow same book", res, 403, {})
        
            let obj = {}
            obj.user = req.params.userId
            obj.book = req.params.bookId
            obj.quantity = 1
            obj.status = 1
            let bookingBook = new userBookingModel(obj)
            if(await bookingBook.save()){
                let currentQuantityOfBook = (book.quantity - 1)
                await bookModel.findOneAndUpdate({_id:req.params.bookId},{$set:{quantity:currentQuantityOfBook}})
                return sendResponse("Success", res, 200, {})
            }
            return sendResponse("something went wrong please try again", res, 200, {})
        } catch (error) {
            return sendResponse(error.message, res, 500, {})
        }
    },
    returnBook: async (req, res) =>{
        try {
            // REQUEST VALIDATION
            const requestValidation = await inputValidation(req.params, "borrowBook");
            if (requestValidation) return sendResponse(requestValidation, res, 403,{});
            // validate book
            let book = await bookModel.findOne({_id:req.params.bookId})
            if(!book)         
            return sendResponse("invalid book", res, 403, {})
            
            // validate user with book id
            let isUserBookVerify = await userBookingModel.findOne({user:req.params.userId, book:req.params.bookId, status:1})
            if(!isUserBookVerify)         
            return sendResponse("Book not allowted on this user", res, 403, {})
            
            // delete borrow book on user 
            let deleteBorrowBook = await userBookingModel.findOneAndUpdate({user:req.params.userId, book:req.params.bookId, status:1},{$set:{status:3}})
            
            if(deleteBorrowBook){
                let currentQuantityOfBook = (book.quantity + 1)
                await bookModel.findOneAndUpdate({_id:req.params.bookId},{$set:{quantity:currentQuantityOfBook}})
                return sendResponse("Success", res, 200, {})
            }
           
            return sendResponse("something went wrong please try again", res, 200, {})
        } catch (error) {
            return sendResponse(error.message, res, 500, {})
        }
    },
    userBorrowBookList: async (req, res)=>{
        try {
            if(!req.params.userId || req.params.userId === undefined)
                return sendResponse("user id is required", res, 403, {}) 

                let bookingList = await userBookingModel.aggregate([
                    {
                        $match:{user:new ObjectId(req.params.userId), status:1}
                    },
                    {
                        $lookup: {
                            from: "books",
                            localField: "book",
                            foreignField: "_id",
                            as: "bookdetail"
                          }
                    },
                    {$unwind:"$bookdetail"},
                    {
                        $project:{
                            title:"$bookdetail.title",
                            isbn:"$bookdetail.isbn",
                            author:"$bookdetail.author",
                            bookId:"$book",
                            borrowDate:"$createdAt"
                        }
                    }

                ])
            return sendResponse("Success", res, 200, {bookingList})
        } catch (error) {
            return sendResponse(error.message, res, 500, {})
        }
    }
}