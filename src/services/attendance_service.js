const attendanceModel = require("../models/attendance_model");
const userService = require("../services/user_service");
const { requestResponse } = require("../utils");
const id = require("date-fns/locale/id");
const parseISO = require("date-fns/parseISO");
const format = require("date-fns/format");
const { startOfDay, endOfDay } = require("date-fns");

let response;
const create = async ({ user, type }) => {
  const sod = startOfDay(new Date());
  const eod = endOfDay(new Date());
  const data = await find({
    user,
    type,
    createdAt: {
      $gte: sod,
      $lte: eod,
    },
  });
  console.log(data);
  if (data !== null) {
    response = {
      ...requestResponse.unprocessable_entity,
      message: `Anda Sudah absen ${type}  hari ini.`,
    };
    return response;
  }
  await attendanceModel.create({ user, type });
  response = { ...requestResponse.success };
  return response;
};

const find = async (condition) => {
  const data = await attendanceModel.findOne(
    { ...condition },
    { _id: false },
    { lean: true }
  );
  return data;
};

const get = async (condition = {}, projection = {}) => {
  const absen = await attendanceModel.find(condition, {
    _id: false,
    ...projection,
  });
  return absen;
};

const aggregate = async (pipeline = []) => {
  const absen = await attendanceModel.aggregate(pipeline);
  return absen;
};

module.exports = {
  create,
  get,
  find,
  aggregate,
};
