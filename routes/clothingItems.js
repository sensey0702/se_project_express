// GET /items — returns all clothing items
// POST /items — creates a new item
// DELETE /items/:itemId — deletes an item by _id

const router = require("express").Router();

router.get("/", () => {
  console.log("GET items");
});

router.get("/:itemId", () => {
  console.log("GET items/:itemId");
});

router.post("/", () => {
  console.log("POST items");
});

module.exports = router;
