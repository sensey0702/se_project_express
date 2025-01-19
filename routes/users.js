const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");

router.get("/:userId", getCurrentUser);
router.patch("/me", updateProfile);

module.exports = router;
