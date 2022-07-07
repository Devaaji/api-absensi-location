const coordinateModel = require("../models/coordinate_model");
const { requestResponse } = require("../utils");

let response;
const create = async ({ lat, long, range }) => {
  await coordinateModel.deleteMany();
  await coordinateModel.create({ lat, long, range });
  response = { ...requestResponse.success };
  return response;
};

const get = async () => {
  const location = await coordinateModel.find(
    {},
    { _id: false },
    { lean: true }
  );
  return location;
};

module.exports = { create, get };
