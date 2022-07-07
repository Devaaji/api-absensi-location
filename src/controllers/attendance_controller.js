const attendanceService = require("../services/attendance_service");
const userService = require("../services/user_service");
const { requestResponse } = require("../utils");
const logger = require("../utils/logger");
const { startOfWeek, endOfWeek, startOfDay, endOfDay } = require("date-fns");
let response;

const create = async (req, res) => {
  try {
    console.log(req.guid);
    const absenTime = await attendanceService.create({
      user: req.guid,
      ...req.body,
    });
    response = { ...absenTime };
  } catch (err) {
    logger.error(err);
    response = { ...requestResponse.server_error };
  }
  res.status(response.code).json(response);
};

const getAbsens = async (req, res) => {
  try {
    const absens = await attendanceService.get();
    if (!(absens.length > 0)) {
      response = { ...requestResponse.success, message: "tidak ada data" };
      return res.status(response.code).json(response);
    }
    response = { ...requestResponse.success, data: absens };
  } catch (err) {
    logger.error(err);
    response = { ...requestResponse.server_error };
  }
  res.status(response.code).json(response);
};

const getTotalAttendance = async (req, res) => {
  try {
    const today = new Date().setHours(0, 0, 0, 0);
    const startDate = startOfWeek(today, {
      locale: "id",
      weekStartsOn: 1,
    });
    const endDate = endOfWeek(today, {
      locale: "id",
    });
    const pipeline = [
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          datas: {
            $push: "$$ROOT",
          },
        },
      },
    ];

    const totalAttendance = await attendanceService.aggregate(pipeline);
    // const totalAttendance = await attendanceService.get({
    //   createdAt: {
    //     $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    //     $lt: new Date(
    //       today.getFullYear(),
    //       today.getMonth(),
    //       today.getDate() + 1
    //     ),
    //   },
    // });
    const data = totalAttendance.map((val) => {
      const res = {
        date: val._id,
        masuk: val.datas.filter((item) => item.type === "masuk").length,
        pulang: val.datas.filter((item) => item.type === "keluar").length,
      };
      return res;
    });

    let totalMasuk = 0;
    let totalPulang = 0;
    for (let i = 0; i < data.length; i++) {
      totalMasuk += data[i].masuk;
      totalPulang += data[i].pulang;
    }
    response = {
      ...requestResponse.success,
      data: {
        totalMasuk: totalMasuk,
        totalPulang: totalPulang,
        dataAbsen: data,
      },
    };
  } catch (err) {
    logger.info(err);
    response = { ...requestResponse.server_error };
  }
  res.status(response.code).json(response);
};

const getDetailAttendance = async (req, res) => {
  try {
    const { guid } = req.params;
    const today = new Date().setHours(0, 0, 0, 0);
    const startDate = startOfWeek(today, {
      locale: "id",
      weekStartsOn: 1,
    });
    const endDate = endOfWeek(today, {
      locale: "id",
    });
    const user = await userService.find(
      {
        guid: guid,
      },
      { password: false }
    );
    const pipeline = [
      {
        $match: {
          user: guid,
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          datas: {
            $push: "$$ROOT",
          },
        },
      },
    ];

    const totalAttendance = await attendanceService.aggregate(pipeline);
    // const totalAttendance = await attendanceService.get({
    //   createdAt: {
    //     $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    //     $lt: new Date(
    //       today.getFullYear(),
    //       today.getMonth(),
    //       today.getDate() + 1
    //     ),
    //   },
    // });
    const data = totalAttendance.map((val) => {
      const res = {
        date: val._id,
        masuk: val.datas.filter((item) => item.type === "masuk").length,
        pulang: val.datas.filter((item) => item.type === "keluar").length,
      };
      return res;
    });

    let totalMasuk = 0;
    let totalPulang = 0;
    for (let i = 0; i < data.length; i++) {
      totalMasuk += data[i].masuk;
      totalPulang += data[i].pulang;
    }
    response = {
      ...requestResponse.success,
      data: {
        ...user,
        totalMasuk: totalMasuk,
        totalPulang: totalPulang,
        dataAbsen: data,
      },
    };
  } catch (err) {
    logger.info(err);
    response = { ...requestResponse.server_error };
  }
  res.status(response.code).json(response);
};

module.exports = {
  create,
  getAbsens,
  getTotalAttendance,
  getDetailAttendance,
};
