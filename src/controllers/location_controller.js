const coordinateService = require("../services/coordinate_service");
const { requestResponse } = require("../utils");
const logger = require("../utils/logger");
let response;

const create = async (req, res) => {
  try {
    const absenPoint = await coordinateService.create(req.body);
    response = { ...absenPoint };
  } catch (err) {
    logger.error(err);
    response = { ...requestResponse.server_error };
  }
  res.status(response.code).json(response);
};

const getLocation = async (req, res) => {
  try {
    const locations = await coordinateService.get();
    if (!(locations.length > 0)) {
      response = {
        ...requestResponse.success,
        message: "No absent locations found",
      };
      return res.status(response.code).json(response);
    }
    response = { ...requestResponse.success, data: locations[0] };
  } catch (err) {
    logger.error(err);
    response = { ...requestResponse.server_error };
  }
  res.status(response.code).json(response);
};

module.exports = {
  create,
  getLocation,
};
