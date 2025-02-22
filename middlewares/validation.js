const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  return helpers.error("string.email");
};

const validateCreateItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name must be at most 30 characters",
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": "Image URL is required",
      "string.uri": "Image URL must be valid",
    }),
    weather: Joi.string().required().valid("hot", "warm", "cold").messages({
      "string.empty": "Weather is required",
      "any.only": 'Weather must be one of ["hot", "warm", "cold"]',
    }),
  }),
});

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name must be at most 30 characters",
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": "Image URL is required",
      "string.uri": "Image URL must be valid",
    }),
    email: Joi.string().required().custom(validateEmail).messages({
      "string.empty": "Email is required",
      "string.email": "Email must be valid",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required",
    }),
  }),
});

const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail).messages({
      "string.empty": "Email is required",
      "string.email": "Email must be valid",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required",
    }),
  }),
});

const validateUpdateProfileInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name must be at most 30 characters",
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": "Image URL is required",
      "string.uri": "Image URL must be valid",
    }),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().alphanum().length(24).required().messages({
      "string.base": "Item ID must be a string",
      "string.empty": "Item ID required",
      "string.length": "Item ID must be 24 characters long",
      "string.alphanum": "Item ID must be a hexadecimal value",
    }),
  }),
});

module.exports = {
  validateCreateItem,
  validateUserInfo,
  validateId,
  validateUserLogin,
  validateUpdateProfileInfo,
};
