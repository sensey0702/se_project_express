const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const { SUCCESS_CREATED_STATUS_CODE } = require("../utils/errors");
const ConflictError = require("../errors/ConflictError");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");

const createUser = (req, res, next) => {
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
        next(new ConflictError(`${email} is already in use`));
      }
      if (err.name === "ValidationError") {
        next(
          new BadRequestError("The server does not understand this request")
        );
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Error- cannot be found"));
      }
      if (err.name === "CastError") {
        next(
          new BadRequestError("The server does not understand this request")
        );
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("The password and email fields are required");
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError("Incorrect email or password"));
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  const { _id } = req.user;
  const { name, avatar } = req.body;
  const opts = { new: true, runValidators: true };

  return User.findByIdAndUpdate({ _id }, { name, avatar }, opts)
    .then((updatedProfile) => {
      if (!updatedProfile) {
        throw new NotFoundError("This profile could not be found");
      }
      return res.send(updatedProfile);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError("The server does not understand this request")
        );
      } else {
        next(err);
      }
    });
};

module.exports = { createUser, getCurrentUser, login, updateProfile };
