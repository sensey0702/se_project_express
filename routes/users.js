// GET /users — returns all users
// GET /users/:userId - returns a user by _id
// POST /users — creates a new user

const router = require("express").Router();

router.get("/", () => {
  console.log("GET users");
});

router.get("/:userId", () => {
  console.log("GET users/:userId");
});

router.post("/", () => {
  console.log("POST users");
});

module.exports = router;
