require("dotenv").config();
const jwt = require("jsonwebtoken");
const { requestResponse } = require("../utils");
const publicKey = process.env.SECRET_KEY;

/**
 * Express middleware to parse bearer token and extract its value
 * @function
 * @returns {function(...[*]=)}
 */
module.exports = () => {
  return async (req, res, next) => {
    let valid = true;
    let token;
    if (req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts[0] !== "Basic") {
        if (parts.length === 2 && parts[0] === "Bearer") {
          try {
            token = jwt.verify(parts[1], publicKey);
            req.guid = token.guid;
            req.email = token.email;
            req.role = token.role;
            console.log(parts[1]);
          } catch (error) {
            const response = { ...requestResponse.unauthorized };
            response.message = "Invalid token";

            return res.status(response.code).json(response);
          }
        } else {
          valid = false;
        }
      }
    }

    if (!valid) {
      const response = { ...requestResponse.incomplete_body };
      response.message = "Malformed token supplied";
      return res.status(response.code).json(response);
    } else {
      next();
    }
  };
};
