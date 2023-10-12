const { Validator } = require("node-input-validator");

const register = {
  username: "required|string",
  email: "required|email",
  password: "required|minLength:8",
};
const login = {
    email: "required|email",
    password: "required|minLength:8",
  };
const addBook = {
    title: "required|string",
    author: "required|string",
    isbn: "required",
    quantity:"required|integer"
};
const borrowBook = {
  userId: "required|string",
  bookId: "required|string",
};

const validationSchema = {
  register:register,
  login:login,
  addBook:addBook,
  borrowBook:borrowBook
};

// validation function
const inputValidation = async (data, type) => {
  const v = new Validator(data, validationSchema[type]);
  const valid = await v.check();
  if (!valid) {
    return v.errors[Object.keys(v.errors)[0]].message;
  } else {
    return false;
  }
};

module.exports = { inputValidation };
