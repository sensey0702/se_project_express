// GET /users — returns all users
// GET /users/:userId - returns a user by _id
// POST /users — creates a new user

const router = require("express").Router();
const {
  getUsers,
  createUser,
  getUser,
  login,
} = require("../controllers/users");

router.post("/signin", login);
router.post("/signup", createUser);

module.exports = router;
