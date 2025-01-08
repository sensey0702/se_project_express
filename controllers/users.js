const User = require("../models/user");
const {
  SUCCESS_CREATED_STATUS_CODE,
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
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
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(SUCCESS_CREATED_STATUS_CODE).send(user))
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
  console.log(name, avatar);
};

// GET /users/:userId
const getUser = (req, res) => {
  const { userId } = req.params;
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

module.exports = { getUsers, createUser, getUser };
