const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const collectionName = "coordinate";

const schema = new mongoose.Schema(
  {
    guid: {
      type: String,
      default: () => uuidv4(),
    },
    lat: {
      type: String,
    },
    long: {
      type: String,
    },
    range: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    collection: collectionName,
  }
);

module.exports = mongoose.model(collectionName, schema);
