const {sendResponse}= require("../../config/helper")
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const userModel = require("../models/Users")
const {inputValidation} = require("../../validators/userValidator")
require('dotenv').config();
const secretKey = process.env.JWT_SECRET_KEY
module.exports = {
    register: async (req, res) =>{
        try {
             // REQUEST VALIDATION
                const requestValidation = await inputValidation(req.body, "register");
                if (requestValidation) return sendResponse(requestValidation, res, 403,{});
            
             // verify user email
                let checkUserName = await userModel.findOne({email:req.body.email})
                if (checkUserName) return sendResponse("email already exists ", res, 403,{});
                
                let saveUser = new userModel(req.body)
                await saveUser.save()
           
                return sendResponse("User registered successfully", res, 200, {})
        } catch (error) {
            return sendResponse(error.message, res, 500, {})
        }
    },
    login: async (req, res) =>{
        try {
                // REQUEST VALIDATION
               const requestValidation = await inputValidation(req.body, "login");
               if (requestValidation) return sendResponse(requestValidation, res, 403,{});
           
                // verify user email
               let isValidEmail = await userModel.findOne({email:req.body.email})
               if (!isValidEmail) return sendResponse("Invalid email id record not found", res, 200,{});

                // if user account has been blocked   
               if(isValidEmail.status === parseInt(process.env.INACTIVE))
                return sendResponse("your account has been blocked please contact admin", res, 200,{});
               
                // if user account has been delete
               if(isValidEmail.status === parseInt(process.env.DELETE))
                return sendResponse("Invalid user", res, 200,{});
               
                isValidEmail.comparePassword(req.body.password, async (err, isMatch) => {
                if (!isMatch) {
                    return sendResponse('You have entered incorrect password', res, 422, {})
                } else {
                    let payload = { _id: isValidEmail._id, username: isValidEmail.username, email: isValidEmail.email}
                    let userJwtToken = await jwt.sign(payload,secretKey,{ expiresIn: process.env.JWT_EXPIRES_IN });
                    return sendResponse("Success", res, 200, { token: "Bearer " + userJwtToken })
                }
            })
       } catch (error) {
           return sendResponse(error.message, res, 500, {})
       }
    },
}