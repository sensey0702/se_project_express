// GET /items — returns all clothing items
// POST /items — creates a new item
// DELETE /items/:itemId — deletes an item by _id

const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);

router.delete("/:itemId", deleteItem);

router.post("/", createItem);

router.put("/:itemId/likes", likeItem);

router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
