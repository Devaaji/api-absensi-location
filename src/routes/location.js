const router = require("express").Router();
const locationController = require("../controllers/location_controller");
const { checkRequest, requiredRequest } = require("../utils");

router.post(
  "/",
  checkRequest(requiredRequest.authorization),
  locationController.create
);

router.get(
  "/",
  checkRequest(requiredRequest.authorization),
  locationController.getLocation
);

module.exports = router;
