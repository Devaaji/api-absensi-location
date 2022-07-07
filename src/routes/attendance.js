const router = require("express").Router();
const attendanceController = require("../controllers/attendance_controller");
const { checkRequest, requiredRequest } = require("../utils");

router.post(
  "/",
  checkRequest(requiredRequest.absent),
  attendanceController.create
);
router.get("/", attendanceController.getAbsens);
router.get("/total-attendance", attendanceController.getTotalAttendance);
router.get("/:guid", attendanceController.getDetailAttendance);

module.exports = router;
