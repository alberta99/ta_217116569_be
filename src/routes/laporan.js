const express = require("express");

const laporanController = require("../controller/laporan");

const router = express.Router();

//Get All Sales
router.get(
  "/leadidsalestanggal/:id_sales/:tanggal_start/:tanggal_end",
  laporanController.getLeadBySalesTanggal
);

router.get("/allsales", laporanController.getAllSales);

router.get("/allorder", laporanController.getAllOrder);
router.get(
  "/allorderbytgl/:tanggal_start/:tanggal_end",
  laporanController.getAllOrderByTanggal
);

router.get("/conversionrate", laporanController.getConversionRate);
router.get(
  "/conversionratebysales",
  laporanController.getConversionRateBySales
);

module.exports = router;
