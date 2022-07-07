const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const collectionName = "report";

const schema = new mongoose.Schema(
  {
    guid: {
      type: String,
      default: () => uuidv4(),
    },
    masuk: {
      type: Object, //masuk/pulang
    },
    keluar: {
      type: Object, //masuk/pulang
    },
    date: {
      type: Date,
      default: () => new Date(),
    },
  },
  {
    versionKey: false,
    collection: collectionName,
  }
);

module.exports = mongoose.model(collectionName, schema);
