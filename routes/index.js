const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const auth = require("../middlewares/auth");
const { createUser, login } = require("../controllers/users");
const { getItems } = require("../controllers/clothingItems");
const NotFoundError = require("../errors/NotFoundError");

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

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
router.use("*", (req, res, next) => {
  next(new NotFoundError("Error- route not found"));
});

module.exports = router;
