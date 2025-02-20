const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const auth = require("../middlewares/auth");
const { createUser, login } = require("../controllers/users");
const { getItems } = require("../controllers/clothingItems");

const { NOT_FOUND_STATUS_CODE } = require("../utils/errors");
const {
  validateUserLogin,
  validateUserInfo,
} = require("../middlewares/validation");

// crash test - remove after code review
router.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

router.post("/signin", validateUserLogin, login);
router.post("/signup", validateUserInfo, createUser);
router.get("/items", getItems);

router.use(auth);
console.log("auth should be set now!");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
router.use("*", (req, res) => {
  res
    .status(NOT_FOUND_STATUS_CODE)
    .send({ message: "Requested resource not found" });
});

module.exports = router;
