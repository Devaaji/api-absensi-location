const mongoose = require("mongoose");
const collectionName = "otp";

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    otp: {
      type: String,
    },
    createdAt: { type: Date, expires: "5m", default: Date.now },
  },
  {
    versionKey: false,
    collection: collectionName,
  }
);

module.exports = mongoose.model(collectionName, schema);
