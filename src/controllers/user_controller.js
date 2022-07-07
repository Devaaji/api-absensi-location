const userService = require("../services/user_service");
const otpService = require("../services/otp_service");
const { requestResponse } = require("../utils");
const logger = require("../utils/logger");

let response;

const registration = async (req, res) => {
  try {
    const user = await userService.create({
      ...req.body,
      role: "karyawan",
    });
    if (user.status) {
      const { email } = user.data;
      await otpService.createOTP({
        email: email,
      });
    }

    response = { ...user };
  } catch (err) {
    logger.error(err);
    response = { ...requestResponse.server_error };
  }
  res.status(response.code).json(response);
};

const resendOtpMail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userService.find({ email });
    if (user === null) {
      response = {
        ...requestResponse.unprocessable_entity,
        message: "No user with that email",
      };
      return res.status(response.code).json(response);
    }

    if (user.verified) {
      response = {
        ...requestResponse.unprocessable_entity,
        message: "User already verified",
      };
      return res.status(response.code).json(response);
    }

    await otpService.clearOTP({ email });
    const otp = await otpService.createOTP({
      email: email,
    });

    response = { ...otp };
  } catch (err) {
    logger.error(err);
    response = { ...requestResponse.server_error };
  }
  res.status(response.code).json(response);
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await otpService.validateOTP({ email, otp });
    response = { ...user };
  } catch (err) {
    logger.error(err);
    response = { ...requestResponse.server_error };
  }
  res.status(response.code).json(response);
};

const getUsers = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 10;

    const users = await userService.get(
      {},
      {},
      {
        page,
        perPage,
      }
    );
    const allUser = users.filter((data) => data.role == "karyawan");
    if (!(allUser.length > 0)) {
      response = { ...requestResponse.success, message: "tidak ada data" };
      return res.status(response.code).json(response);
    }
    response = { ...requestResponse.success, data: allUser };
  } catch (err) {
    logger.error(err);
    response = { ...requestResponse.server_error };
  }

  res.status(response.code).json(response);
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const loginResponse = await userService.loginAdmin({ email, password });
    response = { ...loginResponse };
  } catch (error) {
    logger.error(error);
    response = { ...requestResponse.server_error };
  }

  res.status(response.code).json(response);
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const loginResponse = await userService.loginUser({ email, password });
    response = { ...loginResponse };
  } catch (error) {
    logger.error(error);
    response = { ...requestResponse.server_error };
  }

  res.status(response.code).json(response);
};

const getProfile = async (req, res) => {
  try {
    const { guid } = req.query;
    const user = await userService.find(
      { guid: guid },
      { password: false, verified: false }
    );
    response = { ...requestResponse.success, data: user };
  } catch (error) {
    logger.error(error);
    response = { ...requestResponse.server_error };
  }
  res.status(response.code).json(response);
};

module.exports = {
  registration,
  resendOtpMail,
  verifyOtp,
  getUsers,
  loginAdmin,
  loginUser,
  getProfile,
};
