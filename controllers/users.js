const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  SUCCESS_CREATED_STATUS_CODE,
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
  UNAUTHORIZED_STATUS_CODE,
} = require("../utils/errors");

// GET /users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

// POST /users
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then((user) =>
      res.status(SUCCESS_CREATED_STATUS_CODE).send({
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      })
    )
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: `${email} is already in use` });
      }
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "The server does not understand this request" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

// GET /users/:userId
const getCurrentUser = (req, res) => {
  const { userId } = req.user;
  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Error- cannot be found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "The server does not understand this request" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return res
          .status(UNAUTHORIZED_STATUS_CODE)
          .send({ message: "Incorrect email or password" });
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send(token);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

const updateProfile = (req, res) => {
  const { userId } = req.user;
  const { name, avatar } = req.body;
  const opts = { new: true, runValidators: true };

  return User.findByIdAndUpdate({ userId }, { name, avatar }, opts)
    .then((updatedProfile) => {
      if (!updatedProfile) {
        return res
          .set(NOT_FOUND_STATUS_CODE)
          .send({ message: "This profile could not be found" });
      }
      return res.send(updatedProfile);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "The server does not understand this request" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { getUsers, createUser, getCurrentUser, login, updateProfile };
