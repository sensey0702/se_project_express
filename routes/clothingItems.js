// GET /items — returns all clothing items
// POST /items — creates a new item
// DELETE /items/:itemId — deletes an item by _id

const router = require("express").Router();
const {
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
  getItems,
} = require("../controllers/clothingItems");

router.delete("/:itemId", deleteItem);

router.post("/", createItem);

router.put("/:itemId/likes", likeItem);

router.delete("/:itemId/likes", dislikeItem);

router.get("/", getItems);

module.exports = router;
