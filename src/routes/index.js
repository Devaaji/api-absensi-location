const router = require("express").Router();
const userController = require("../controllers/user_controller");
const totalController = require("../controllers/total_controller");
const { checkRequest, requiredRequest } = require("../utils");

const location = require("./location");
const attendance = require("./attendance");
const report = require("./report");

router.post(
  "/registration",
  checkRequest(requiredRequest.registration),
  userController.registration
);
router.post(
  "/resend-otp",
  checkRequest(requiredRequest.resend_otp),
  userController.resendOtpMail
);
router.post(
  "/registration/verify",
  checkRequest(requiredRequest.verify_otp),
  userController.verifyOtp
);

router.post(
  "/auth/login",
  checkRequest(requiredRequest.login),
  userController.loginAdmin
);

router.post(
  "/auth/login-user",
  checkRequest(requiredRequest.login),
  userController.loginUser
);

router.get(
  "/users/me",
  checkRequest(requiredRequest.authorization),
  userController.getProfile
);

router.get(
  "/users",
  checkRequest(requiredRequest.authorization),
  userController.getUsers
);

router.get(
  "/data-status",
  checkRequest(requiredRequest.authorization),
  totalController.allDataAmount
);
router.use("/locations", location);
router.use("/attendance", attendance);
router.use("/report", report);

module.exports = router;
