const ClothingItem = require("../models/clothingItem");
const {
  SUCCESS_CREATED_STATUS_CODE,
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
  UNAUTHORIZED_STATUS_CODE,
} = require("../utils/errors");

//  GET /items returns all clothing items
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server" });
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
          .send({ message: "The server does not understand this request" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server" });
    });
  console.log(name, weather, imageUrl);
};

// DELETE /items/:itemId deletes an item by _id
const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const { userId } = req.user;

  Clothing.Item.findById(itemId)
    .then((item) => {
      //find item by ID
      if (!item) {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Item not found" });
      }
      // check if the owner of the item and the userId match
      if (item.owner.toString() !== userId) {
        return res.status(UNAUTHORIZED_STATUS_CODE).send({
          message: "You do not have required permission for this action",
        });
      }

      //  delete item if owner and userId match
      return ClothingItem.findByIdAndDelete(itemId).then((deletedItem) => {
        console.log("Item Deleted");
        return res.send(deletedItem);
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "The server does not understand this request" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

// PUT /items/:itemId/likes — like an item
const likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((updatedItem) => {
      res.status(SUCCESS_CREATED_STATUS_CODE).send(updatedItem);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Error- cannot be found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "The server does not understand this request" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server" });
    });

// DELETE /items/:itemId/likes - unlike an item
const dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .then((updatedItem) => {
      if (!updatedItem) {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Item not found" });
      }
      return res.send(updatedItem);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Error- cannot be found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "The server does not understand this request" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server" });
    });

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
