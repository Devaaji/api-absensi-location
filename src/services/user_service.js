require("dotenv").config();
const user_model = require("../models/user_model");
const { requestResponse } = require("../utils");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const privateKey = process.env.SECRET_KEY;

let response;

const create = async ({ name, email, password, imei, role }) => {
  const user = await find({ email });
  if (user !== null) {
    response = {
      ...requestResponse.unprocessable_entity,
      message: "E-mail already registered",
    };
    return response;
  }

  const salt = 10;
  const hashedPassword = await bcrypt.hash(password, salt);

  await user_model.create({
    name,
    email,
    password: hashedPassword,
    imei,
    role,
  });

  response = { ...requestResponse.success, data: { name, email } };
  return response;
};

const find = async (condition = {}, projection = {}) => {
  return user_model.findOne(
    { ...condition },
    {
      _id: false,
      ...projection,
    },
    {
      lean: true,
    }
  );
};

const get = async (
  conditions = {},
  projection = {},
  additionalConditions = { perPage: 0, page: 0 }
) => {
  const users = await user_model
    .find(conditions, { _id: false, password: 0, ...projection })
    .skip((additionalConditions.page - 1) * additionalConditions.perPage)
    .limit(additionalConditions.perPage)
    .lean();
  return users;
};

const update = async (condition, data) => {
  const user = await user_model.updateOne(condition, data);
  return user;
};

const loginAdmin = async ({ email, password }) => {
  const user = await find({ email: email });

  if (user === null) {
    response = {
      ...requestResponse.unprocessable_entity,
      message: "E-mail not registered",
    };
    return response;
  }

  if (user.role !== "admin") {
    response = {
      ...requestResponse.unprocessable_entity,
      message: "Access not alowed",
    };
    return response;
  }

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    response = {
      ...requestResponse.unauthorized,
      message: "Password is incorrect",
    };
    return response;
  }

  const token = jwt.sign(
    {
      guid: user.guid,
      email: user.email,
      role: user.role,
    },
    privateKey,
    { expiresIn: "7d" }
  );

  response = {
    ...requestResponse.success,
    data: {
      email: user.email,
      role: user.role,
      token,
    },
  };

  return response;
};

const loginUser = async ({ email, password }) => {
  const user = await find({ email: email, verified: true });

  if (user === null) {
    response = {
      ...requestResponse.unprocessable_entity,
      message: "E-mail not registered or verified",
    };
    return response;
  }

  if (user.role !== "karyawan") {
    response = {
      ...requestResponse.unprocessable_entity,
      message: "Access not alowed",
    };
    return response;
  }

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    response = {
      ...requestResponse.unauthorized,
      message: "Password is incorrect",
    };
    return response;
  }

  const token = jwt.sign(
    {
      guid: user.guid,
      email: user.email,
      role: user.role,
    },
    privateKey,
    { expiresIn: "7d" }
  );

  response = {
    ...requestResponse.success,
    data: {
      user,
      token,
    },
  };

  return response;
};

module.exports = {
  loginAdmin,
  loginUser,
  create,
  find,
  get,
  update,
};
