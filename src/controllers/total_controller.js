const userService = require("../services/user_service");
const attendanceService = require("../services/attendance_service");
const { requestResponse } = require("../utils");
const logger = require("../utils/logger");
let response;
const allDataAmount = async (req, res) => {
  try {
    //nanti bikin collection nya ada tgl,masuk,keluar
    const users = await userService.get({ verified: { $exists: true } });
    const absens = await attendanceService.get();
    const userValid = users.filter((data) => data.verified == true);
    const userUnValid = users.filter((data) => data.verified == false);
    const absenMasuk = absens.filter((data) => data.type == "masuk");
    const absenKeluar = absens.filter((data) => data.type == "keluar");
    response = {
      ...requestResponse.success,
      data: {
        users: { verified: userValid.length, unVerified: userUnValid.length },
        absens: { masuk: absenMasuk.length, keluar: absenKeluar.length },
      },
    };
  } catch (err) {
    logger.error(err);
    response = { ...requestResponse.server_error };
  }

  res.status(response.code).json(response);
};

module.exports = { allDataAmount };
