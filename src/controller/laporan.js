const laporanModel = require("../models/laporan");

const getLeadBySalesTanggal = async (req, res) => {
  const id_sales = req.params.id_sales;
  const tgl_start = req.params.tanggal_start;
  const tgl_end = req.params.tanggal_end;
  try {
    const [data] = await laporanModel.getLeadBySalesTanggal(
      id_sales,
      tgl_start,
      tgl_end
    );
    return res.json({
      message: "Get Lead By ID Sales & Tanggal Sukses",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      serverMessage: error,
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

const getAllOrder = async (req, res) => {
  try {
    const data = await laporanModel.getAllOrder();
    res.json({
      message: "Get All Order Sukses",
      data: data[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      serverMessage: error,
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
  getLeadBySalesTanggal,
  getAllSales,
  getAllOrder,
  getAllOrderByTanggal,
  getConversionRate,
  getConversionRateBySales,
};
