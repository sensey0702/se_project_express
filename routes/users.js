const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { validateUpdateProfileInfo } = require("../middlewares/validation");

router.patch("/me", validateUpdateProfileInfo, updateProfile);
router.get("/me", getCurrentUser);

module.exports = router;
