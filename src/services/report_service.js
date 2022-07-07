const reportModel = require("../models/report_model");
const { requestResponse } = require("../utils");
let response;

const create = async (absen) => {
  const masuk = await absen.filter((user) => user.type == "masuk");
  const keluar = await absen.filter((user) => user.type == "keluar");
  await reportModel.create({ masuk, keluar });
  response = { ...requestResponse.success };
  return response;
};

const get = async () => {
  const reports = await reportModel.find({}, { _id: 0 });
  return reports;
};

module.exports = {
  create,
  get,
};
