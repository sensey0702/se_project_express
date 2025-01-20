const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");

router.get("/:userId", getCurrentUser);
router.patch("/me", updateProfile);
router.get("/me", getCurrentUser);

module.exports = router;
