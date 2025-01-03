// GET /users — returns all users
// GET /users/:userId - returns a user by _id
// POST /users — creates a new user

const router = require("express").Router();
const { getUsers, createUser, getUser } = require("../controllers/users");

router.get("/", getUsers);

router.get("/:userId", getUser);

router.post("/", createUser);

module.exports = router;
