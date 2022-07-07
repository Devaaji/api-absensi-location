require("dotenv").config();
const http = require("http");
const logger = require("./src/utils/logger");
const app = require("./src/app");

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
	logger.info(`Server is running on port ${process.env.PORT}`);
});
