const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const collectionName = "users";

const schema = new mongoose.Schema(
  {
    guid: {
      type: String,
      default: () => uuidv4(),
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    imei: {
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
