const jwt = require("jsonwebtoken");
const { UNAUTHORIZED_STATUS_CODE } = require("../utils/errors");

const handleAuthError = (res) => {
  res
    .status(UNAUTHORIZED_STATUS_CODE)
    .send({ message: "Authorization Required" });
};

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(res);
  }
  const token = authorization.replace("Bearer ", ""); //remove bearer
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET); //verify the token
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload; // adding the payload to the Request object

  next(); // passing the request further along
};

module.exports = auth;
