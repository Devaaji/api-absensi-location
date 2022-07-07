const router = require("express").Router();
const reportController = require("../controllers/report_controller");
router.post("/", reportController.createReport);
router.get("/", reportController.getReports);

module.exports = router;
