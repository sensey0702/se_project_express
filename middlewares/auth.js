const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/UnauthorizedError");

// const handleAuthError = () => {
//   throw new UnauthorizedError("Authorization Required");
// };

const auth = (req, res, next) => {
  console.log("Auth middleware called");
  const { authorization } = req.headers; // get authorization from the header

  if (!authorization || !authorization.startsWith("Bearer ")) {
    // check if the header exists and starts with 'Bearer '
    console.log("Auth header missing or incorrect");
    return next(new UnauthorizedError("Authorization Required"));
  }
  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
    console.log("Token verified payload:", payload);
  } catch (err) {
    return next(new UnauthorizedError("Authorization Required"));
  }

  req.user = payload; // adding the payload to the Request object

  return next(); // passing the request further along
};

module.exports = auth;
