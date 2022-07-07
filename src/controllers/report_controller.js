const reportService = require("../services/report_service");
const attendanceService = require("../services/attendance_service");
const { requestResponse } = require("../utils");
const logger = require("../utils/logger");
let response;

const createReport = async (req, res) => {
  try {
    const absen = await attendanceService.get();
    const newReport = await reportService.create(absen);
    response = { ...newReport };
  } catch (err) {
    logger.error(err);
    response = { ...requestResponse.server_error };
  }
  res.status(response.code).json(response);
};

const getReports = async (req, res) => {
  try {
    const reports = await reportService.get();
    if (!reports > 0) {
      response = { ...requestResponse.success, message: "tidak ada data" };
      return res.status(response.code).json(response);
    }
    response = { ...requestResponse.success, data: reports };
  } catch (err) {
    logger.error(err);
    response = { ...requestResponse.server_error };
  }
  res.status(response.code).json(response);
};
module.exports = { createReport, getReports };
