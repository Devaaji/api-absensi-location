require("dotenv").config();
const compression = require("compression");
const helmet = require("helmet");
const express = require("express");
const format = require("date-fns/format");
const morgan = require("morgan");
const bearerToken = require("./middlewares/bearer_token");
const { cors } = require("./config");
const router = require("./routes");
const mongoDb = require("./database/mongo");
const logger = require("./utils/logger");
const { requestResponse } = require("./utils");

morgan.token("date", (req, res, tz) => {
  return `[${format(new Date(), "dd-MM-yyyy HH:mm:ss")}]`;
});

mongoDb.createConnection().then((_) => logger.info("MongoDB connected!"));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan(
    ":date[Asia/Jakarta] :method :url :status :response-time ms - :res[content-length]"
  )
);

app.use(helmet());
app.use(compression());
app.use(cors);
app.use(bearerToken());
app.use(router);
app.use((req, res) => {
  const response = { ...requestResponse.not_found };
  res.status(response.code).json(response);
});

module.exports = app;
