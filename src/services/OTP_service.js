const otpModel = require("../models/otp_model");
const userService = require("../services/user_service");
const mailService = require("../services/mail_service");
const { requestResponse } = require("../utils");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const privateKey = process.env.SECRET_KEY;

let response;

const genrateOTP = async (length) => {
  return Math.floor(
    Math.pow(10, length - 1) +
      Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
  );
};

const createOTP = async ({ email }) => {
  const otpCode = await genrateOTP(6);
  const salt = 10;
  const hashedOTP = await bcrypt.hash(otpCode.toString(), salt);

  await mailService.sendOtpMail({ to: email, otp: otpCode.toString() });
  await otpModel.create({
    email,
    otp: hashedOTP,
  });

  response = {
    ...requestResponse.success,
    message: `OTP has been sent to ${email}`,
  };

  return response;
};

const find = async ({ email }) => {
  const otp = await otpModel.findOne({ email });
  return otp;
};

const clearOTP = async ({ email }) => {
  return otpModel.deleteMany({ email });
};

const validateOTP = async ({ email, otp }) => {
  const user = await userService.find({ email });
  if (user === null) {
    response = {
      ...requestResponse.unprocessable_entity,
      message: "No user with that email",
    };
    return response;
  }

  if (user.verified) {
    response = {
      ...requestResponse.unprocessable_entity,
      message: "User already verified",
    };
    return response;
  }

  const otpData = await find({ email: user.email });
  if (otpData === null) {
    response = {
      ...requestResponse.unprocessable_entity,
      message: "No OTP found or OTP has expired",
    };
    return response;
  }

  const isValid = await bcrypt.compare(otp, otpData.otp);
  if (!isValid) {
    response = {
      ...requestResponse.unprocessable_entity,
      message: "Invalid OTP code",
    };
    return response;
  }

  await userService.update({ guid: user.guid }, { verified: true });
  const userData = await userService.find({ guid: user.guid, verified: true });
  await clearOTP({ email: user.email });

  const token = jwt.sign(
    {
      guid: userData.guid,
      email: userData.email,
      role: userData.role,
    },
    privateKey,
    { expiresIn: "7d" }
  );

  response = {
    ...requestResponse.success,
    data: {
      user: userData,
      token,
    },
  };
  return response;
};

module.exports = {
  genrateOTP,
  createOTP,
  find,
  clearOTP,
  validateOTP,
};
