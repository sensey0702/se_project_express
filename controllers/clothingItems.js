const ClothingItem = require("../models/clothingItem");
const {
  SUCCESS_STATUS_CODE,
  SUCCESS_CREATED_STATUS_CODE,
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
  NO_CONTENT_STATUS_CODE,
} = require("../utils/errors");

//  GET /items returns all clothing items
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(SUCCESS_STATUS_CODE).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(NOT_FOUND_STATUS_CODE).send({ message: err.message });
    });
};

// POST /items creates a new item
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      console.log(item);
      res.status(SUCCESS_CREATED_STATUS_CODE).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      } else
        return res
          .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
          .send({ message: err.message });
    });
  console.log(name, weather, imageUrl);
};

// DELETE /items/:itemId deletes an item by _id
const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .then((deletedItem) => {
      if (!deletedItem) {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Item not found" });
      }
      console.log("Item Deleted");
      res.status(NO_CONTENT_STATUS_CODE).send();
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      } else
        return res
          .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
          .send({ message: err.message });
    });
};

// PUT /items/:itemId/likes — like an item
const likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: owner } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((updatedLikes) => {
      console.log(updatedLikes);
      console.log("Like added");
      res.status(SUCCESS_CREATED_STATUS_CODE).send(updatedLikes);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: err.message });
    });

// DELETE /items/:itemId/likes - unlike an item
const dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: owner } }, // remove _id from the array
    { new: true }
  )
    .then((updatedLikes) => {
      console.log(updatedLikes);
      console.log("Like removed");
      res.status(NO_CONTENT_STATUS_CODE).send(updatedLikes);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: err.message });
    });

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
