const ClothingItem = require("../models/clothingItem");
const { SUCCESS_CREATED_STATUS_CODE } = require("../utils/errors");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");

//  GET /items returns all clothing items
const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(next);
};

// POST /items creates a new item
const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(SUCCESS_CREATED_STATUS_CODE).send(item);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError("The server does not understand this request")
        );
      } else {
        next(err);
      }
    });
};

// DELETE /items/:itemId deletes an item by _id
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const { _id } = req.user;

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      // check if the owner of the item and the userId match
      if (item.owner.toString() !== _id) {
        throw new UnauthorizedError(
          "You do not have required permission for this action"
        );
      }

      //  delete item if owner and userId match
      return ClothingItem.findByIdAndDelete(itemId).then((deletedItem) => {
        return res.send(deletedItem);
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        next(
          new BadRequestError("The server does not understand this request")
        );
      } else {
        next(err);
      }
    });
};

// PUT /items/:itemId/likes — like an item
const likeItem = (req, res, next) =>
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
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Error- cannot be found"));
      }
      if (err.name === "CastError") {
        next(
          new BadRequestError("The server does not understand this request")
        );
      } else {
        next(err);
      }
    });

// DELETE /items/:itemId/likes - unlike an item
const dislikeItem = (req, res, next) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .then((updatedItem) => {
      if (!updatedItem) {
        throw new NotFoundError("Item not found");
      }
      return res.send(updatedItem);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Error- cannot be found"));
      }
      if (err.name === "CastError") {
        next(
          new BadRequestError("The server does not understand this request")
        );
      } else {
        next(err);
      }
    });

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
