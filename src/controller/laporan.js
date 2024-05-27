const moment = require("moment");
const laporanModel = require("../models/laporan");
var idLocale = require("moment/locale/id");
moment.locale("id,", idLocale);

const getLaporanLeadMasuk = async (req, res) => {
  try {
    const [data] = await laporanModel.getLaporanLeadMasuk();
    return res.json({
      message: "Get Laporan Lead Masuk Sukses",
      data: data.map((item) => {
        return {
          ...item,
          tgl_join_lead: moment(item.tgl_join_lead).locale("id").format("LLLL"),
        };
      }),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      serverMessage: error.message,
    });
  }
};

const getAllSales = async (req, res) => {
  try {
    const data = await laporanModel.getAllSales();
    res.json({
      message: "Get All Salesperson Sukses",
      data: data[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      serverMessage: error,
    });
  }
};

const getLaporanSalesperson = async (req, res) => {
  try {
    const tgl_start = req.params.tglstart;
    const tgl_end = req.params.tglend;
    const data = await laporanModel.getLaporanSalesperson(tgl_start, tgl_end);
    res.json({
      message: "Get All Salesperson Sukses",
      data: data[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      serverMessage: error,
    });
  }
};

const getAllOrder = async (req, res) => {
  try {
    const [data] = await laporanModel.getAllOrder();
    res.json({
      message: "Get All Order Sukses",
      data: data.map((item) => {
        return {
          ...item,
          tanggal_order: moment(item.tanggal_order).locale("id").format("LLLL"),
        };
      }),
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      serverMessage: error.message,
    });
  }
};

const getConversionRate = async (req, res) => {
  try {
    const data = await laporanModel.getConversionRate();
    res.json({
      message: "Get Conversion Sukses",
      data: data[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      serverMessage: error,
    });
  }
};

// const getConversionRateByTanggal = async (req, res) => {
//   try {
//     const data = await laporanModel.getConversionRatebyTanggal();
//     res.json({
//       message: "Get Conversion Sukses",
//       data: data[0],
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Server error",
//       serverMessage: error,
//     });
//   }
// };

const getConversionRateBySales = async (req, res) => {
  try {
    const [data] = await laporanModel.getConversionRateBySales();
    res.json({
      message: "Get Conversion Sukses",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      serverMessage: error,
    });
  }
};

const getConversionRateBySalesdanTanggal = async (req, res) => {
  try {
    const tgl_start = req.params.tglstart;
    const tgl_end = req.params.tglend;
    const [data] = await laporanModel.getConversionRateBySalesdanTanggal(
      tgl_start,
      tgl_end
    );
    res.json({
      message: "Get Conversion Sukses",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      serverMessage: error,
    });
  }
};

const getAllOrderByTanggal = async (req, res) => {
  try {
    var tanggal_start = req.params.tanggal_start;
    var tanggal_end = req.params.tanggal_end;
    const data = await laporanModel.getAllOrderByTanggal(
      tanggal_start,
      tanggal_end
    );
    res.json({
      message: "Get All Order By Tanggal Sukses",
      data: data[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      serverMessage: error,
    });
  }
};

module.exports = {
  getLaporanSalesperson,
  getLaporanLeadMasuk,
  getAllSales,
  getAllOrder,
  getAllOrderByTanggal,
  getConversionRate,
  getConversionRateBySales,
  getConversionRateBySalesdanTanggal,
};
