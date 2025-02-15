const router = require("express").Router();
const {
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const { validateCreateItem, validateId } = require("../middlewares/validation");

router.delete("/:itemId", validateId, deleteItem);

router.post("/", validateCreateItem, createItem);

router.put("/:itemId/likes", validateId, likeItem);

router.delete("/:itemId/likes", validateId, dislikeItem);

module.exports = router;
