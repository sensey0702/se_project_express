const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/UnauthorizedError");

const auth = (req, res, next) => {
  const { authorization } = req.headers; // get authorization from the header

  if (!authorization || !authorization.startsWith("Bearer ")) {
    // check if the header exists and starts with 'Bearer '
    return next(new UnauthorizedError("Authorization Required"));
  }
  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError("Authorization Required"));
  }

  req.user = payload; // adding the payload to the Request object

  return next(); // passing the request further along
};

module.exports = auth;
