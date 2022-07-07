const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const collectionName = "atendance";

const schema = new mongoose.Schema(
  {
    guid: {
      type: String,
      default: () => uuidv4(),
    },
    user: {
      type: String,
    },
    type: {
      type: String, //masuk/pulang
    },
    description: {
      type: String,
      default: function () {
        return this.type === "masuk" ? "Absen masuk" : "Absen pulang";
      },
    },
    createdAt: {
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
